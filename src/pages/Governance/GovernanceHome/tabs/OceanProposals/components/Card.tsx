import cx from 'classnames';
import { IOceanProposal } from 'types/oceanProposal';
import { displayAddress } from 'utils/formatter';
import { HintIcon } from 'resources/icons';
import { TokenIconGridList, TokenStatus, TruncateDisplay, Antd } from 'components';
import { PROPOSAL_STATUS_MAP } from 'utils/status';
import useBscUrls from 'hooks/useExplorerUrls';
import styles from './Card.module.scss';
import useOceanLendingContract from 'hooks/useOceanLendingContract';
import { areEqualAddresses } from 'utils/web3';

type TProps = IOceanProposal & {
  isSelected: boolean;
  onClick: () => any;
};

const Card: React.FC<TProps> = (props) => {
  const { getContractUrl } = useBscUrls();
  const { oceanLendingContract } = useOceanLendingContract();
  const { isSelected, onClick, status, proposer, endBlock, currencies, targetContract } = props;

  return (
    <div
      className={cx(styles.card, 'relative cursor-pointer text-primary py-5 px-4 rounded-md', {
        [styles.active]: isSelected
      })}
      onClick={onClick}>
      <div className="flex justify-between items-start mb-5" style={{ minHeight: 76 }}>
        <div className="flex flex-col">
          <div className="text-left mb-4">
            <span className="block text-primary text-xs">Proposer</span>
            <span className="block text-white font-medium text-lg uppercase">
              <TruncateDisplay title={proposer}>{displayAddress(proposer)}</TruncateDisplay>
            </span>
          </div>
          <div className="text-left">
            <span className="flex items-center text-primary text-xs">
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
              <TruncateDisplay title={targetContract}>
                {areEqualAddresses(oceanLendingContract?.address, targetContract)
                  ? 'Ocean lending'
                  : 'Unrecognized'}
              </TruncateDisplay>
            </a>
          </div>
        </div>
        <div className="text-right">
          <div className="text-primary text-right text-xs">Currencies</div>
          <TokenIconGridList
            data={currencies.map(({ symbol }, index) => ({ symbol: symbol || index + '' }))}
            rowClassName="flex justify-end"
          />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div className="text-left">
          <span className="block text-primary text-xs">End Block</span>
          <span className="block text-white font-medium text-lg">{endBlock}</span>
        </div>
        <TokenStatus status={status} statusMap={PROPOSAL_STATUS_MAP} />
      </div>
    </div>
  );
};

export default Card;
