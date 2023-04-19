import cx from 'classnames';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { Antd } from 'components';

import styles from './Input.module.scss';

type TProps = {
  onChange: (...arg: any[]) => void;
  value?: string;
  size?: SizeType;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  bordered?: boolean;
};

const Input: React.FC<TProps> = ({
  onChange = () => {},
  value,
  size = 'large',
  placeholder = '',
  className,
  ...rest
}) => {
  return (
    <div className={cx(styles.inputBox, className)}>
      <Antd.Input
        className={styles.input}
        placeholder={placeholder}
        size={size}
        value={value}
        allowClear
        onChange={onChange}
        {...rest}
      />
    </div>
  );
};

export default Input;
