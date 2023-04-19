import { useSelector } from 'react-redux';
import { Antd } from 'components';
import styles from './index.module.scss';

// TODO: update when integrate with API
type TProps = {
  ipfsError?: boolean;
  leasePeriod?: string | number;
  aggregationStrategy?: number;
  onChangePeriod?: (...args: any) => any;
  onChangeAggregationStrategy?: (...args: any) => any;
};

const FormLease: React.FC<TProps> = ({ leasePeriod, aggregationStrategy, ipfsError }) => {
  const aggregationStrategyMap = useSelector((state: any) => state.common.aggregationStrategy);

  return (
    <div className={styles.wrapper}>
      <div className="flex items-center justify-between mb-4 text-white">
        Aggregation Strategy:
        <span className={styles.value}>
          <Antd.Skeleton
            className="flex items-center"
            paragraph={false}
            loading={aggregationStrategy === undefined && !ipfsError}
            active>
            {aggregationStrategy !== undefined ? aggregationStrategyMap[aggregationStrategy] : '--'}
          </Antd.Skeleton>
        </span>
      </div>
      <div className="flex items-center justify-between text-white">
        Lease Period:
        <span className={styles.value}>
          <Antd.Skeleton
            className="flex items-center"
            paragraph={false}
            loading={!leasePeriod && !ipfsError}
            active>
            {leasePeriod || '--'}
          </Antd.Skeleton>
        </span>
      </div>
    </div>
  );
};

export default FormLease;
