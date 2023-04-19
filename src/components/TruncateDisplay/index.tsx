import { ReactNode } from 'react';
import { Antd } from 'components';

type TProps = {
  className?: string;
  children?: string | ReactNode;
  title?: string;
};

const TruncateDisplay: React.FC<TProps> = ({ title, className, children }: TProps) => (
  <Antd.Tooltip title={title || children}>
    <div className={`truncate ${className}`}>{children}</div>
  </Antd.Tooltip>
);

export default TruncateDisplay;
