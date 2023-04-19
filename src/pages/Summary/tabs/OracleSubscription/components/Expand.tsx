import { useState } from 'react';
import cx from 'classnames';
import { getUpdateTimeDisplay } from 'utils/time';
import { displayAddress, displayPrice } from 'utils/formatter';
import { CollapseIcon, CopyIcon } from 'resources/icons';
import { TokenStatus, TokenIcon, Antd } from 'components';
import { copyToClipboard } from 'utils/copy';
import styles from './Expand.module.scss';
import { useSelector } from 'react-redux';
import {
  getAggregationStrategyMap,
  getClientMap,
  getDataSourceMap,
  getSupportedNetworkMap
} from 'modules/common/reducer';
import { IOracleSubscribed } from 'types/oracle';

const { Row, Col, Tooltip } = Antd;

type TProps = IOracleSubscribed & {
  className?: string;
  client: any;
  onCollapse: () => void;
};

const Expand: React.FC<TProps> = ({
  symbol = 'kono',
  decimals = 1,
  value,
  aggregationStrategy = 0,
  networkId = 0,
  leaseEnd,
  status,
  transactionHash,
  client = {},
  updatedTimestamp,
  sources = [],
  onCollapse = () => {}
}) => {
  const clientMap = useSelector(getClientMap);
  const supportedNetworkMap = useSelector(getSupportedNetworkMap);
  const dataSourceMap = useSelector(getDataSourceMap);
  const aggregationStrategyMap = useSelector(getAggregationStrategyMap);
  const [copyTooltip, setCopyTooltip] = useState<string>('Copy to clipboard');

  const handleCollapse = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    onCollapse();
  };

  const handleCopy = (e: React.MouseEvent<HTMLElement>, textValue: string = '') => {
    e.preventDefault();
    copyToClipboard(textValue, (result) => {
      setCopyTooltip(result);
    });
  };

  return (
    <Row
      className={cx(
        styles.container,
        'm-0 relative flex-col overflow-hidden w-full bg-transparent p-8 text-white rounded-md'
      )}
      align="top">
      <Row justify="start" align="middle" className={styles.rowPrice}>
        <TokenIcon size={40} className={styles.tokenIcon} name={symbol} />
        <span className={styles.tokenName}>{symbol}</span>
        <div className={styles.price}>{value ? displayPrice(value, decimals) : '--'}</div>
      </Row>
      <Row justify="start" align="middle" className={styles.rowStatus}>
        <TokenStatus className={styles.tokenStatus} status={status || 1} />
      </Row>
      <Row justify="space-between" className={styles.rowStrategy}>
        <Col span={6}>
          <span className={styles.label}>Updated Time</span>
          <span className={styles.value}>{getUpdateTimeDisplay(updatedTimestamp)}</span>
        </Col>
        <Col span={6}>
          <span className={styles.label}>Aggregation Strategy</span>
          <span className={styles.value}>{aggregationStrategyMap[aggregationStrategy]}</span>
        </Col>
        <Col span={6}>
          <span className={styles.label}>Lease End</span>
          <span className={styles.value}>{leaseEnd}</span>
        </Col>
        <Col span={6}></Col>
      </Row>

      <Row justify="space-between" className={styles.rowTransaction}>
        <Col span={6}>
          <span className={styles.label}>Network</span>
          <span className={styles.value}>{supportedNetworkMap[networkId]?.name || '--'}</span>
        </Col>
        <Col span={6}>
          <span className={styles.label}>Transaction Hash</span>
          <span className={styles.value}>
            {displayAddress(transactionHash)}
            <Tooltip title={copyTooltip}>
              <a
                href="#"
                onClick={(e) => handleCopy(e, transactionHash)}
                onMouseLeave={() => setTimeout(() => setCopyTooltip('Copy to clipboard'), 500)}>
                <CopyIcon />
              </a>
            </Tooltip>
          </span>
        </Col>
        <Col span={6}>
          <span className={styles.label}>Client</span>
          <span className={styles.value}>{client ? clientMap[client?.clientType] : '--'}</span>
        </Col>
        <Col span={6}>
          <span className={styles.label}>Contract Address</span>
          <span className={styles.value}>
            {displayAddress(client?.connectionInfo?.contractAddress) || '--'}
            <Tooltip title={copyTooltip}>
              <a
                href="#"
                onClick={(e) => handleCopy(e, client?.connectionInfo?.contractAddress)}
                onMouseLeave={() => setTimeout(() => setCopyTooltip('Copy to clipboard'), 500)}>
                <CopyIcon />
              </a>
            </Tooltip>
          </span>
        </Col>
      </Row>

      <Row className={styles.dataSourceLabel}>Data Source</Row>
      <Row className={styles.dataSourceList}>
        {sources.map((key) => (
          <TokenIcon
            key={key}
            className={styles.source}
            size={30}
            borderWidth={0}
            name={dataSourceMap[key]}
            text=""
            showName
            withBackground={false}
          />
        ))}
      </Row>
      <a href="#" className={styles.collapseBtn} onClick={handleCollapse}>
        <CollapseIcon />
      </a>
    </Row>
  );
};

export default Expand;
