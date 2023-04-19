import cx from 'classnames';
import { TokenIcon, TokenStatus } from 'components';
import { IOracleSubscribed } from 'types/oracle';
import { displayPrice } from 'utils/formatter';
import styles from './Card.module.scss';

type TProps = IOracleSubscribed & {
  isActive: boolean;
  dataSourceMap: { [key: number]: string };
  onClick: () => void | {};
};

const Card: React.FC<TProps> = (props) => {
  const { isActive, leaseEnd, symbol, value, decimals, onClick } = props;

  return (
    <div
      className={cx(styles.card, {
        [styles.active]: isActive
      })}
      onClick={onClick}>
      <TokenStatus className={styles.status} status={1} showText={true} />
      <div className={styles.body}>
        <div className={styles.left}>
          <span className={styles.symbol}>{symbol}</span>
          <TokenIcon name={symbol} size={70} borderWidth={4} />
        </div>
        <div className={styles.right}>
          <span className={styles.price}>{displayPrice(value, decimals)}</span>
          <span className={styles.endDate}>Lease End: {leaseEnd}</span>
        </div>
      </div>
    </div>
  );
};

export default Card;
