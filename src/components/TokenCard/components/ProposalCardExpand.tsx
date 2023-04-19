import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { TokenStatus, DataSourceList, FormParachain, FormLease, Antd, Voting } from 'components';
import { PROPOSAL_STATUS_MAP, PROPOSAL_STATUS_STYLE } from 'utils/status';
import { areEqualAddresses } from 'utils/web3';
import { getSelectedAccount } from 'modules/account/reducer';
import { IOracleProposal } from 'types/oracleProposal';
import useGovernorContract from 'hooks/useGovernorContract';
import useClient from 'hooks/useClient';
import styles from './ProposalCardExpand.module.scss';
import useExecutionRender from 'hooks/useExecutionRender';

type TProps = IOracleProposal & {};

const ProposalCardExpand: React.FC<TProps> = ({
  status = 1,
  targetContract,
  forVotes,
  againstVotes,
  proposalId,
  proposer,
  ipfsError,
  ipfsData
}: TProps) => {
  const { symbol, slug, sources, aggregationStrategy, leasePeriod, client } = ipfsData || {};
  const { renderExecution } = useExecutionRender({
    status,
    targetContract,
    proposer,
    proposalId
  });
  const { isVoting, isVoted, hasVoted, voteProposal } = useGovernorContract();
  const { clientName, clientConnectionInfo = {} } = useClient(client);
  const selectedAccount = useSelector(getSelectedAccount);
  const [reason, setReason] = useState<string>('');

  const isProposer = areEqualAddresses(selectedAccount?.address, proposer);

  useEffect(() => {
    hasVoted(proposalId);
  }, [hasVoted, proposalId]);

  // reset reason on change symbol
  useEffect(() => {
    setReason('');
  }, [symbol, setReason]);

  return (
    <div className={cx(styles.wrapper, 'text-white relative')}>
      <div
        className={cx(styles.status, 'absolute top-0 left-0 px-4 py-2')}
        style={PROPOSAL_STATUS_STYLE[status]}>
        <TokenStatus
          status={status}
          statusMap={PROPOSAL_STATUS_MAP}
          style={{ color: PROPOSAL_STATUS_STYLE[status].color }}
        />
      </div>
      <div className={cx(styles.innerCard, 'w-full flex gap-8 px-8')}>
        <div className="flex flex-col text-left justify-center">
          <div className={cx(styles.nameInfo, 'mt-8')}>
            <div className={styles.label}>Symbol</div>
            <div className="text-lg mb-4 font-bold">{symbol}</div>
            <div className={styles.label}>Slug</div>
            <div className="text-lg font-bold whitespace-nowrap overflow-hidden overflow-ellipsis">
              {slug}
            </div>
          </div>
        </div>
        <div className="w-1/4 my-4 text-left items-stretch">
          <div className={styles.label}>Client</div>
          <span className="block capitalize text-lg text-white font-semibold">
            <Antd.Skeleton
              className="flex items-center"
              paragraph={false}
              loading={!clientName && !ipfsError}
              active>
              {clientName || '--'}
            </Antd.Skeleton>
          </span>
          <div className={cx(styles.clientBody, 'w-full mt-4')}>
            {clientName === 'Substrate' && <FormParachain {...clientConnectionInfo} />}
            {clientName === 'Contract' && (
              <div className="min-h-full h-full flex text-center items-center px-2">
                Contract address will be displayed after proposal execution
              </div>
            )}
            {ipfsError && (
              <div className="min-h-full flex justify-center items-center">Not found from IPFS</div>
            )}
          </div>
        </div>
        <div className="my-4 text-left">
          <div className={styles.label}>Data Sources</div>
          <DataSourceList error={ipfsError} sources={sources} />
        </div>
        <div className="w-1/4 mt-4 text-left">
          <div className={cx(styles.label, 'mb-4')}>Other Details</div>
          <FormLease
            ipfsError={ipfsError}
            aggregationStrategy={aggregationStrategy}
            leasePeriod={leasePeriod}
          />
        </div>
      </div>
      <Voting
        isProposer={isProposer}
        isVoted={isVoted}
        isVoting={isVoting}
        status={status}
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

export default ProposalCardExpand;
