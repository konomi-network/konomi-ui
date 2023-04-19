import { connect } from 'react-redux';
import cx from 'classnames';
import { getUpdateTimeDisplay } from 'utils/time';
import { Button, TokenIcon, TokenStatus, Antd } from 'components';
import styles from './TokenCard.module.scss';
import { RootState } from 'modules/rootReducer';
import { getAggregationStrategyMap, getDataSourceMap } from 'modules/common/reducer';

const { Row, Col } = Antd;

type TProps = {
  dataSourceMap: { [key: string | number]: string };
  aggregationStrategyMap?: { [key: number]: string };
  aggregationStrategy?: number;
  sources?: Array<any>;
  symbol?: string;
  status?: number;
  toSubscribe?: boolean;
  updatedTimestamp?: any;
  onCollapse: () => void;
  onAdd?: () => {};
  onRemove?: () => {};
};

const Expand: React.FC<TProps> = ({
  symbol = 'kono',
  aggregationStrategy = 0,
  updatedTimestamp,
  sources = [],
  status = 1,
  toSubscribe = false,
  onAdd,
  onRemove,
  // schema
  dataSourceMap = {},
  aggregationStrategyMap = {}
}: TProps) => {
  return (
    <Row
      className={cx(styles.expandRow, 'relative overflow-hidden w-full px-5 py-4 ml-0 text-white')}
      align="middle">
      <TokenIcon size={240} borderWidth={0} className={styles.coinBackground} name={symbol} />

      <Col md={24} lg={8} className="p-2">
        <Row className="text-left">
          <Col span={12}>
            <div className={styles.tokenName}>{symbol}</div>
          </Col>
          <Col span={12}>
            <div className={styles.label}>Aggregation Strategy</div>
            <div className={styles.value}>{aggregationStrategyMap[aggregationStrategy]}</div>
          </Col>
        </Row>
        <Row className="text-left">
          <Col span={12}>
            <div className={styles.label}>Status</div>
            <div className={styles.value}>
              <TokenStatus status={status} />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.label}>Latest Update</div>
            <div className={styles.value}>{getUpdateTimeDisplay(updatedTimestamp)}</div>
          </Col>
        </Row>
      </Col>

      <Col md={24} lg={16} className={styles.dataSources} style={{ padding: '8px 8px 24px 36px' }}>
        <Row justify="space-between" align="top">
          <div className={styles.title}>Data Source</div>
          {status === 1 && (
            <Button className={styles.addButton} onClick={toSubscribe ? onRemove : onAdd}>
              {toSubscribe ? 'Remove from Subscription List' : 'Add to Subscription List'}
            </Button>
          )}
        </Row>
        <Row gutter={12} justify="start" className="mt-4">
          <Col>
            <Row align="stretch" className="gap-x-10">
              {sources.map((key: any) => (
                <Col key={key}>
                  <TokenIcon
                    className={styles.icon}
                    size={30}
                    borderWidth={0}
                    name={dataSourceMap[key]}
                    showName
                    withBackground={false}
                  />
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: RootState) => ({
  dataSourceMap: getDataSourceMap(state),
  aggregationStrategyMap: getAggregationStrategyMap(state)
});

export default connect(mapStateToProps)(Expand);
