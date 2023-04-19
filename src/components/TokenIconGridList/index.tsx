import cx from 'classnames';
import { TokenIconList } from 'components';

// TODO: need to correct props type
type TProps = {
  data: Array<{ symbol: string }>;
  className?: string;
  rowClassName?: string;
};

const TokenIconGridList: React.FC<TProps> = ({ data = [], className, rowClassName }: TProps) => {
  const row1 = data.length > 2 ? data.slice(0, 2) : data;
  const row2 = data.slice(2);

  return (
    <div className={cx('flex flex-col gap-1 mt-2', className)}>
      <div className={rowClassName || 'flex justify-end'}>
        <TokenIconList data={row1} cutoffCount={0} />
      </div>
      <div className={rowClassName || 'flex justify-end'}>
        <TokenIconList data={row2} cutoffCount={row2.length > 1 ? 1 : 0} />
      </div>
    </div>
  );
};

export default TokenIconGridList;
