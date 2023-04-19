import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import cx from 'classnames';
import { Antd } from 'components';
import styles from './index.module.scss';

type TProps = {
  options?: any[];
  className?: string;
  value?: number | string;
  placeholder?: string | React.ReactElement;
  disabled?: boolean;
  defaultValue?: number | string;
  optionFilterProp?: string;
  onSelect?: () => any;
  onChange?: (value: any) => any;
};

const Selector: React.FC<TProps> = ({ options = [], className, ...rest }) => {
  return (
    <div className={cx(styles.lining, className)}>
      <Antd.Select
        suffixIcon={<CaretDownOutlined className="text-primary" style={{ fontSize: '1rem' }} />}
        style={{ width: '100%' }}
        options={options}
        optionLabelProp="label"
        {...rest}
      />
    </div>
  );
};

export default Selector;
