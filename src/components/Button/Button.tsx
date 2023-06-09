import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import cx from 'classnames';
import styles from './Button.module.scss';

type TProps = {
  children?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => {} | void;
};

const Button: React.FC<TProps> = (props) => {
  const { onClick = () => {}, isLoading, className, disabled, children, ...rest } = props;

  return (
    <button
      className={cx(styles.button, className, {
        [styles.disabled]: disabled,
        [styles.loading]: isLoading
      })}
      onClick={onClick}
      disabled={disabled}
      {...rest}>
      {children}
      {isLoading && (
        <LoadingOutlined style={{ color: 'currentColor', fontSize: 16 }} className="ml-2" />
      )}
    </button>
  );
};

export default Button;
