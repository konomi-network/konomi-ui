import { memo } from 'react';
import cx from 'classnames';
import {
  Button,
  FormParachain,
  TokenIcon,
  DataSourceList,
  FormLease,
  TokenStatus,
  Antd
} from 'components';
import { PROPOSAL_STATUS_STYLE, PROPOSAL_STATUS_MAP } from 'utils/status';
import { IOracleProposal } from 'types/oracleProposal';
import useClient from 'hooks/useClient';
import useKonoAllowance from 'hooks/useKonoAllowance';
import useGovernorContract from 'hooks/useGovernorContract';

import styles from './Expand.module.scss';

const { Col, Skeleton } = Antd;
type TProps = IOracleProposal & {};

const Expand: React.FC<TProps> = (props: TProps) => {
  const { proposalId, targetContract, status, ipfsData, ipfsError } = props;
  const { symbol, slug, sources, aggregationStrategy, leasePeriod, client } = ipfsData || {};
  const { allowance, onClickIncreaseAllowance } = useKonoAllowance(targetContract);
  const { clientName, clientConnectionInfo } = useClient(client);
  const { execute } = useGovernorContract();

  const handleExecution = () => {
    execute(proposalId);
  };

  const renderExecutionBtn = () => {
    if (status === 2) {
      // TODO: need to check allowance for oracleGovernor contract
      //       in the future when the KONO fee is charged
      if (allowance === 0) {
        return (
          <Button
            className={'w-full py-1 capitalize mt-5 text-white'}
            onClick={() => onClickIncreaseAllowance()}>
            Increase allowance
          </Button>
        );
      }

      return (
        <Button
          className={cx(
            styles.execButton,
            'w-full bg-primary py-1 capitalize transition-opacity opacity-100 mt-5'
          )}
          onClick={handleExecution}>
          Execute
        </Button>
      );
    }
    return null;
  };

  return (
    <div className={cx(styles.expand, 'relative flex justify-between items-start')}>
      <div
        className={cx(styles.status, 'absolute top-0 left-0 px-4 py-2')}
        style={PROPOSAL_STATUS_STYLE[status]}>
        <TokenStatus
          status={status}
          statusMap={PROPOSAL_STATUS_MAP}
          style={{ color: PROPOSAL_STATUS_STYLE[status].color }}
        />
      </div>
      <div className={styles.execution}>
        <div className={styles.token}>
          <TokenIcon className="mr-6" name={symbol} size={74} borderWidth={4} />
          <div className={styles.tokenName}>
            <div className="mb-2">
              <span className="block text-xs text-primary">Symbol</span>
              <span className={styles.value}>{symbol}</span>
            </div>
            <div>
              <span className="block text-xs text-primary whitespace-nowrap overflow-hidden overflow-ellipsis">
                Slug
              </span>
              <span className={styles.value}>{slug}</span>
            </div>
          </div>
        </div>
        {renderExecutionBtn()}
      </div>

      <div className={cx(styles.client, 'flex flex-col justify-start')}>
        <div className="w-full mb-4 text-left">
          <span className="block">Client</span>
          <span className="block capitalize text-lg text-white font-semibold">
            <Skeleton
              className="h-7 flex items-center"
              paragraph={false}
              loading={!clientName && !ipfsError}
              active>
              {clientName || '--'}
            </Skeleton>
          </span>
        </div>
        <div className={styles.clientBody}>
          {clientName === 'Substrate' && <FormParachain {...clientConnectionInfo} />}
          {clientName === 'Contract' && (
            <div className="h-full flex text-center items-center px-2 text-white">
              Contract address will be displayed after proposal execution
            </div>
          )}
          {ipfsError && (
            <div className="h-full flex justify-center items-center">Not found from IPFS</div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start justify-between">
        <div className="block text-xs text-primary">Data Sources</div>
        <DataSourceList error={ipfsError} sources={sources} />
      </div>

      <div className={styles.others}>
        <span className="block text-xs text-primary mb-4">Other Details</span>
        <FormLease
          ipfsError={ipfsError}
          leasePeriod={leasePeriod}
          aggregationStrategy={aggregationStrategy}
        />
      </div>
    </div>
  );
};

const ExpandWrapper: React.FC<any> = ({ order, ...rest }: any) => {
  return (
    <Col
      span={24}
      order={order}
      xs={{ order: order + 1 }}
      md={{ order: Math.ceil(order / 2) * 2 + 1 }}
      lg={{ order: Math.ceil(order / 3) * 3 + 1 }}
      xl={{ order: Math.ceil(order / 4) * 4 + 1 }}
      {...rest}></Col>
  );
};

const MemoizedExpand = memo(Expand);

export { MemoizedExpand as Expand, ExpandWrapper };
