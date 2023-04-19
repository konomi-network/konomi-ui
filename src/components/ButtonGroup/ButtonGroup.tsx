import React from 'react';
import cx from 'classnames';

import styles from './ButtonGroup.module.scss';

type TProps = {
  className?: string;
  mode?: 'dark' | 'light' | undefined;
  options?: { label: string; value: string | number }[];
  value: string | number;
  onChange?: (...arg: any) => {};
  readOnly?: boolean;
};

const ButtonGroup: React.FC<TProps> = ({
  className,
  mode,
  options = [],
  value,
  readOnly,
  onChange = () => {}
}) => {
  return (
    <div
      className={cx(
        styles.buttonGroup,
        {
          [styles.dark]: mode === 'dark'
        },
        className
      )}>
      {options.map((item) => (
        <button
          key={item.value}
          className={cx(
            {
              [styles.selected]: item.value === `${value}`
            },
            className
          )}
          disabled={readOnly}
          onClick={() => onChange && onChange(item.value)}>
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
