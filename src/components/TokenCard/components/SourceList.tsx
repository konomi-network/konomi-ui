import cx from 'classnames';
import { TokenIconList } from 'components';

// TODO: need to correct props type
type TProps = {
  data: Array<any>;
  map: { [key: string | number]: any };
  className?: string;
  rowClassName?: string;
};

const SourceList: React.FC<TProps> = ({ data = [], map = {}, className, rowClassName }: TProps) => {
  const formattedData = data.map((key) => ({ symbol: map[key] }));
  const row1 = formattedData.length > 2 ? formattedData.slice(0, 2) : formattedData;
  const row2 = formattedData.slice(2);

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

export default SourceList;
