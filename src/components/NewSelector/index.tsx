import cx from 'classnames';
import styles from './index.module.scss';

type Option = {
  label: string;
  value: string | number;
};

type TProps = {
  className?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  disabled?: boolean;
  options: Option[];
  onChange: (value: string | number) => void;
};

const Selector: React.FC<TProps> = ({
  disabled,
  className,
  options,
  placeholder,
  defaultValue,
  onChange,
  ...rest
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (disabled) return;

    const value = e.target.value;
    onChange(value);
  };

  return (
    <select
      className={cx(
        styles.select,
        'bg-[#3A2E48] rounded-md text-xs text-gray-300 font-bold px-3 h-9 cursor-pointer outline-none relative',
        'transition border border-[transparent] hover:border-primary',
        disabled ? 'cursor-not-allowed' : '',
        className
      )}
      onChange={(e) => handleChange(e)}
      defaultValue={defaultValue ? defaultValue : ''}
      required
      {...rest}>
      <option value="" disabled hidden>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
};

export default Selector;
