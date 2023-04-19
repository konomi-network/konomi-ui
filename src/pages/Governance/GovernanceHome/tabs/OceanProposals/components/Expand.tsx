import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProposalType } from '@konomi-network/client';
import cx from 'classnames';

import { Collapse, TokenIcon, TokenStatus, Voting } from 'components';
import fieldSettings from 'pages/Oceans/config';
import { PROPOSAL_STATUS_MAP, PROPOSAL_STATUS_STYLE } from 'utils/status';
import { ICollateral, IInterest, IOceanProposal } from 'types/oceanProposal';
import { getSelectedAccount } from 'modules/account/reducer';
import proposalActions from 'modules/proposals/actions';

import { areEqualAddresses, getTimeFromBlock } from 'utils/web3';
import useGovernorContract from 'hooks/useGovernorContract';
import useBlockTime from 'hooks/useBlockTime';
import useExecutionRender from 'hooks/useExecutionRender';
import useCurrentBlockNumber from 'hooks/useCurrentBlockNumber';
import styles from './Expand.module.scss';

type TProps = IOceanProposal & {
  className?: string;
};

const Expand: React.FC<TProps> = (props) => {
  const {
    status,
    proposer,
    proposalId,
    forVotes,
    againstVotes,
    currencies,
    closeFactor,
    targetContract,
    endBlock,
    liquidationIncentive
  } = props;
  const dispatch = useDispatch();
  const { renderExecution } = useExecutionRender({
    status,
    targetContract,
    proposer,
    proposalId
  });
  const { blockTime } = useBlockTime();
  const { hasVoted, voteProposal, isVoted, isVoting } = useGovernorContract();
  const { currentBlock, isCurrentBlockFetching } = useCurrentBlockNumber();
  const selectedAccount = useSelector(getSelectedAccount);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [reason, setReason] = useState('');

  const selectedCurrencyInfo = currencies.find((t) => t.underlying === selectedCurrency);

  const endTimeString = useMemo(() => {
    if (isCurrentBlockFetching) return '--';
    return getTimeFromBlock(endBlock - currentBlock, blockTime);
  }, [blockTime, currentBlock, endBlock, isCurrentBlockFetching]);

  useEffect(() => {
    // re-update status to REJECTED:1 when time ends and current status is ACTIVE:0
    if (!endTimeString && status === 0) {
      dispatch(
        proposalActions.UPDATE_PROPOSAL({
          id: proposalId,
          data: { status: 1, proposalType: ProposalType.NewOcean }
        })
      );
    }
  }, [dispatch, endTimeString, proposalId, status]);

  // auto select 1st token
  useEffect(() => {
    if (currencies && currencies.length > 0) {
      setSelectedCurrency(currencies[0]?.underlying?.toString());
    }
  }, [currencies]);

  useEffect(() => {
    hasVoted(proposalId);
  }, [hasVoted, proposalId]);

  return (
    <div
      className={cx(
        styles.container,
        'm-0 relative flex-col overflow-hidden w-full bg-transparent text-white rounded-md'
      )}>
      <div
        className={cx(styles.status, 'absolute top-0 left-0 px-4 py-3 rounded-br-lg')}
        style={PROPOSAL_STATUS_STYLE[status]}>
        <TokenStatus
          status={status}
          statusMap={PROPOSAL_STATUS_MAP}
          style={{ color: PROPOSAL_STATUS_STYLE[status].color }}
        />
      </div>
      <div className={cx(styles.oceanConfig, 'w-full px-10 mt-14 mb-8')}>
        <Collapse
          showCollapse
          title="Ocean Config"
          options={[
            {
              label: 'Close Factor',
              type: 'text',
              style: 'percentage',
              value: closeFactor
            },
            {
              label: 'Liquidation Incentive',
              type: 'text',
              value: liquidationIncentive
            },
            {
              label: 'End time',
              type: 'text',
              value: endTimeString ? `in ${endTimeString}` : 'Ended'
            }
          ]}
        />
      </div>
      <div className="flex gap-x-12 p-10 pt-0">
        <div className="flex flex-col">
          <span className="font-bold text-lg text-primary text-left mb-1">Currencies</span>
          <div className="rounded-md border-primary border border-solid w-80 h-auto overflow-hidden">
            {currencies.map((p) => (
              <div
                key={p.underlying}
                onClick={() => setSelectedCurrency(p.underlying)}
                className={cx(
                  styles.currency,
                  'uppercase flex justify-start py-2 px-3 cursor-pointer',
                  {
                    [styles.active]: p.underlying === selectedCurrency
                  }
                )}>
                <TokenIcon showName size={24} borderWidth={1} name={p.symbol || 'Unknown'} />
              </div>
            ))}
          </div>
        </div>
        {!!selectedCurrencyInfo && (
          <div className="flex w-full flex-col gap-y-10">
            <div className="flex justify-between gap-x-6">
              <Collapse
                showCollapse
                key={1}
                title="Currency Info"
                options={[
                  {
                    label: 'Address',
                    type: 'text',
                    style: 'address',
                    value: selectedCurrencyInfo.underlying
                  }
                ]}
              />
              <Collapse
                showCollapse
                key={2}
                title="Collateral Settings"
                options={fieldSettings.collateralSettingFields.map((info) => ({
                  ...info,
                  value:
                    selectedCurrencyInfo.collateral[info.field as keyof ICollateral] ||
                    info.defaultValue
                }))}
              />
            </div>
            <div className="w-1/2">
              <Collapse
                showCollapse
                key={2}
                title="Interest Rate Model"
                options={fieldSettings.interestRateSettingFields.map((info) => ({
                  ...info,
                  value:
                    selectedCurrencyInfo.interest[info.field as keyof IInterest] ||
                    info.defaultValue
                }))}
              />
            </div>
          </div>
        )}
      </div>
      <Voting
        status={status}
        isProposer={!!selectedAccount && areEqualAddresses(selectedAccount.address, proposer)}
        isVoted={isVoted}
        isVoting={isVoting}
        handleReject={() => voteProposal({ proposalId, isApprove: false, reason })}
        handleApprove={() => voteProposal({ proposalId, isApprove: true })}
        handleChangeReason={(e) => setReason(e.target.value)}
        rejectReason={reason}
        rejectCount={againstVotes}
        approveCount={forVotes}
      />
      {renderExecution()}
    </div>
  );
};

export default Expand;
