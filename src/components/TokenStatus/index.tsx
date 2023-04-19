import cx from 'classnames';
import { StatusDotIcon } from 'resources/icons';
import { CURRENCY_STATUS_MAP } from 'utils/status';

import styles from './TokenStatus.module.scss';

type TProps = {
  status: number;
  showText?: boolean;
  className?: string;
  statusMap?: Partial<typeof CURRENCY_STATUS_MAP>;
  style?: Record<string, string>;
};

const TokenStatus: React.FC<TProps> = ({
  className,
  status = 0,
  showText = true,
  statusMap,
  style = {}
}: TProps) => (
  <div
    className={cx(styles.status, className)}
    style={{
      color: (statusMap || CURRENCY_STATUS_MAP)[status]?.color,
      ...style
    }}>
    <StatusDotIcon />
    {showText && (
      <span className="font-semibold">{(statusMap || CURRENCY_STATUS_MAP)[status]?.text}</span>
    )}
  </div>
);

export default TokenStatus;
