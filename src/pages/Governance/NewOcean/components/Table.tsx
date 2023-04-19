import cx from 'classnames';

type TProps = {
  children?: any;
  title: string;
  className?: string;
};

const Table: React.FC<TProps> = ({ children, title, className }) => {
  return (
    <div className="text-left">
      <span className="font-bold text-lg text-primary">{title}</span>
      <div className={cx('flex flex-col rounded mt-1 overflow-hidden bg-tableBg', className)}>
        {children}
      </div>
    </div>
  );
};

export default Table;
