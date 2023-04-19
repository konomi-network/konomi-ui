import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { ProposalType } from '@konomi-network/client';

import { TokenStatus, TruncateDisplay, Antd } from 'components';

import { IOceanProposal } from 'types/oceanProposal';
import { IOracleProposal } from 'types/oracleProposal';

import { PROPOSAL_STATUS_MAP } from 'utils/status';
import { displayAddress } from 'utils/formatter';
import { areEqualAddresses } from 'utils/web3';
import { HintIcon } from 'resources/icons';

import useOceanLendingContract from 'hooks/useOceanLendingContract';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useExplorerUrls from 'hooks/useExplorerUrls';

import { getCurrentOracleSubscriptionAddress } from 'modules/connection/reducer';
import { getBlockTime } from 'modules/common/reducer';
import { getBlockDate, getTimestampDate } from 'utils/time';
import styles from './ProposalCard.module.scss';

type TProps = (IOracleProposal | IOceanProposal) & {
  className?: string;
  active?: boolean;
  onClick: () => any;
};

const ProposalCard: React.FC<TProps> = ({
  active = false,
  endBlock,
  startBlock,
  targetContract,
  proposalType,
  proposer,
  status = 1,
  onClick
}: TProps) => {
  const { library } = useActiveWeb3React();
  const { oceanLendingContract } = useOceanLendingContract();
  const { getContractUrl } = useExplorerUrls();

  const blockTime = useSelector(getBlockTime);
  const oracleAddress = useSelector(getCurrentOracleSubscriptionAddress);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const renderTargetContract = () => {
    switch (proposalType) {
      case ProposalType.NewOracle:
        return areEqualAddresses(oracleAddress, targetContract) ? 'Oracle' : 'Unrecognized';
      case ProposalType.NewOcean:
        return areEqualAddresses(oceanLendingContract?.address, targetContract)
          ? 'Ocean Lending'
          : 'Unrecognized';
      default:
        return 'Unrecognized';
    }
  };
  const renderProposalType = () => {
    switch (proposalType) {
      case ProposalType.NewOracle:
        return 'New Oracle';
      case ProposalType.NewOcean:
        return 'New Ocean';
      default:
        return 'Unknown';
    }
  };

  const getBlockDateAll = useCallback(async () => {
    try {
      if (library) {
        const [startTime, endTime] = await Promise.all([
          getBlockDate(startBlock, library),
          getBlockDate(endBlock, library)
        ]);

        setStartDate(startTime);
        setEndDate(endTime);
      }
    } catch (error) {
      console.log('🚀 getBlockDateAll ~ error', error);
    }
  }, [endBlock, startBlock, library]);

  const getProposalDate = useCallback(async () => {
    try {
      if (library) {
        const currentBlock = await library.eth.getBlockNumber();

        if (currentBlock > endBlock) {
          return await getBlockDateAll();
        }

        const startBlockInfo: any = await library.eth.getBlock(startBlock);
        const periodAsSecond = (endBlock - startBlock) * blockTime;
        const startBlockTime = getTimestampDate(startBlockInfo.timestamp);
        const endBlockTime = getTimestampDate(startBlockInfo.timestamp + periodAsSecond);

        setStartDate(startBlockTime);
        setEndDate(endBlockTime);
      }
    } catch (error) {
      console.log('🚀 getProposalDate ~ error', error);
    }
  }, [blockTime, library, startBlock, endBlock, getBlockDateAll]);

  useEffect(() => {
    getProposalDate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      onClick={onClick}
      className={cx(
        'flex flex-col justify-between bg-[#29263F] cursor-pointer rounded-md pb-5 px-5 pt-3 min-h-[170px]',
        'hover:border-primary',
        active ? 'border-primary' : '',
        styles.container
      )}>
      <div className="flex flex-col justify-start items-start">
        <span className="text-primary text-xs">Proposer</span>
        <TruncateDisplay className="text-xl font-medium uppercase" title={proposer}>
          {displayAddress(proposer)}
        </TruncateDisplay>
      </div>
      <div className="flex gap-x-5 mt-2.5">
        <div className="flex flex-col justify-start items-start">
          <span className="text-primary text-xs flex items-center">
            Target
            <Antd.Tooltip
              placement="top"
              title="The target contract of which the proposal will execute from">
              <HintIcon className="ml-2" width={14} height={14} />
            </Antd.Tooltip>
          </span>
          <a
            rel="noreferrer"
            target="_blank"
            className="capitalize italic block text-white font-medium text-sm underline hover:underline"
            href={getContractUrl(targetContract)}>
            <TruncateDisplay className="text-xs underline italic mt-1" title={targetContract}>
              {renderTargetContract()}
            </TruncateDisplay>
          </a>
        </div>
        <div className="flex flex-col justify-start items-start">
          <span className="text-primary text-xs">Function</span>
          <span className="text-xs italic underline mt-1">{renderProposalType()}</span>
        </div>
      </div>

      <div className="flex items-end justify-between mt-5">
        <div className="flex gap-x-8">
          <div className="flex flex-col items-start">
            <span className="text-primary text-xs">Start Time</span>
            <span className="text-xs italic">{startDate || '--'}</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-primary text-xs">End Time</span>
            <span className="text-xs italic">{endDate || '--'}</span>
          </div>
        </div>
        <TokenStatus status={status} statusMap={PROPOSAL_STATUS_MAP} />
      </div>
    </div>
  );
};

export default ProposalCard;
