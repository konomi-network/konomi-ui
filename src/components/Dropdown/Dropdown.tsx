import { useState } from 'react';
import cx from 'classnames';
import styles from './Dropdown.module.scss';

type TOptions = {
  key: number | string;
  label: string;
  icon?: any;
  iconUrl?: string;
  onChange: (input: any) => {} | void;
};

type TProps = {
  options: TOptions[];
  isOpen?: boolean;
  children?: any;
  className?: string;
};

const Dropdown: React.FC<TProps> = ({
  options = [],
  isOpen = false,
  children,
  className = ''
}: TProps) => {
  const [displayDropdown, setDisplayDropdown] = useState(false);

  return (
    <div
      className={cx(styles.container, className)}
      onMouseOver={() => {
        setDisplayDropdown(true);
      }}
      onMouseLeave={() => {
        setDisplayDropdown(false);
      }}>
      {children}
      <ul
        className={styles.dropdown}
        style={{
          display: isOpen || displayDropdown ? 'block' : 'none'
        }}>
        {options.map((item) => (
          <li
            key={item.key}
            className={cx(
              styles.item,
              'relative rounded-md cursor-pointer mb-2 h-11 bg-themeColor w-[12.5]'
            )}
            onClick={() => item.onChange(item)}>
            <div
              className={cx(
                styles.itemContent,
                'w-full h-full flex justify-center items-center font-bold bg-transparent'
              )}>
              {item.label}
              {!!item.icon && <item.icon className={styles.icon} />}
              {!!item.iconUrl && <img src={item.iconUrl} className={styles.icon} />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dropdown;
