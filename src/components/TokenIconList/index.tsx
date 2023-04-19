import { Antd } from 'components';
import { MoreIcon } from 'resources/icons';
import TokenIcon from '../TokenIcon';
import styles from './index.module.scss';

type TProps = {
  data: any[];
  cutoffCount?: number;
  size?: number;
};

const TokenIconList: React.FC<TProps> = ({ data = [], cutoffCount = 2, size = 24 }) => {
  const list = cutoffCount && data.length > cutoffCount ? data.slice(0, cutoffCount) : data;
  const more = cutoffCount ? data.slice(cutoffCount) : [];

  return (
    <div className={styles.iconList}>
      {list.map((token) => (
        <TokenIcon
          className={styles.tokenIcon}
          size={size}
          borderWidth={0}
          withBackground={false}
          name={token.symbol}
          key={token.symbol}
        />
      ))}
      {/* show more with '...' on hover */}
      {cutoffCount > 0 && data.length > cutoffCount && (
        <Antd.Tooltip title={<TokenIconList data={more} cutoffCount={0} />}>
          <MoreIcon style={{ width: size, height: size }} />
        </Antd.Tooltip>
      )}
    </div>
  );
};

export default TokenIconList;
