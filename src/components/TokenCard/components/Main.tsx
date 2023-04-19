import { connect } from 'react-redux';
import cx from 'classnames';
import { TokenIcon, TokenStatus } from 'components';
import { getUpdateTimeDisplay } from 'utils/time';
import { displayPrice } from 'utils/formatter';
import { AddIcon, CheckIcon } from 'resources/icons';
import { RootState } from 'modules/rootReducer';
import { getDataSourceMap, getReportingStrategyMap } from 'modules/common/reducer';
import SourceList from './SourceList';
import styles from './TokenCard.module.scss';

// TODO: correct type for props
type TProps = {
  active?: boolean;
  aggregationStrategy?: number;
  className?: string;
  dataSourceMap: object;
  decimals?: number;
  sources?: Array<any>;
  status?: number;
  symbol?: string;
  toSubscribe?: boolean;
  updatedTimestamp?: any;
  value?: any;
  onClick: () => void;
  onAdd: () => {};
  onRemove: () => {};
};

const Main: React.FC<TProps> = ({
  active = false,
  className,
  symbol = 'kono',
  decimals = 8,
  value,
  updatedTimestamp,
  sources = [],
  onClick,
  onAdd,
  onRemove,
  toSubscribe = false,
  status = 1,
  dataSourceMap = {}
}: TProps) => {
  const handleToggle = (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
    e.stopPropagation();
    if (toSubscribe) {
      onRemove();
    } else {
      onAdd();
    }
  };

  const renderToggleIcon = () => {
    return toSubscribe ? (
      <CheckIcon onClick={(e) => handleToggle(e)} />
    ) : (
      <AddIcon onClick={(e) => handleToggle(e)} />
    );
  };
  return (
    <div
      className={cx(styles.container, { [styles.selected]: active }, className)}
      onClick={onClick}>
      <div className={styles.row}>
        <div className={styles.token}>
          <TokenIcon className={styles.tokenIcon} name={symbol} size={28} />
          <div className={styles.tokenName}>{symbol}</div>
          <TokenStatus status={status} showText={false} />
        </div>
        {status === 1 && renderToggleIcon()}
      </div>
      <div className={styles.row}>
        <div className={styles.price}>{displayPrice(value, decimals)}</div>
      </div>
      <div className={cx(styles.row, styles.bottom)}>
        <div className={styles.left}>
          <div className={styles.label}>Latest Update</div>
          <div className={styles.value}>{getUpdateTimeDisplay(updatedTimestamp)}</div>
        </div>
        <div className={styles.right}>
          <div className={styles.label}>Sources</div>
          <SourceList data={sources} map={dataSourceMap} />
        </div>
      </div>
    </div>
  );
};

// TODO: correct props type for state
const mapStateToProps = (state: RootState) => ({
  dataSourceMap: getDataSourceMap(state),
  reportingStrategyMap: getReportingStrategyMap(state)
});

export default connect(mapStateToProps)(Main);
