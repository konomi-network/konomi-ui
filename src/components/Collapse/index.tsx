import cx from 'classnames';
import CaretDownOutlined from '@ant-design/icons/CaretDownOutlined';
import { Antd } from 'components';
import styles from './index.module.scss';
import { displayAddress, displayFloat } from 'utils/formatter';
import TruncateDisplay from 'components/TruncateDisplay';

type TProps = {
  title: string;
  options: any[];
  showCollapse?: boolean;
  editable?: boolean;
  className?: string;
};

const Collapse: React.FC<TProps> = ({ title, options, className, editable, showCollapse }) => {
  const displayValue = (o: any) => {
    if (typeof o.value === 'string') {
      if (o.style === 'address')
        return <TruncateDisplay title={o.value}>{displayAddress(o.value)}</TruncateDisplay>;
      return o.value;
    }
    if (o.style === 'percentage') return displayFloat(o.value) + ' %';
    return displayFloat(o.value);
  };

  const renderValueBox = (o: any) => {
    if (['text', 'number'].includes(o.type)) {
      if (editable) {
        return (
          <input
            className="w-full h-full bg-transparent text-center outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            type={o.type}
            value={o.value}
            onChange={(e) => o.onChange(e.target.value)}
            placeholder={o.placeholder}
            {...o.props}></input>
        );
      }

      return <div className="w-full h-full bg-transparent text-center">{displayValue(o)}</div>;
    }

    return (
      <div
        className={`w-full relative h-full flex overflow-hidden text-white ${
          editable ? 'cursor-pointer' : 'pointer-events-none'
        }`}>
        <span
          onClick={() => o.onChange(true)}
          className={`w-1/2 text-center rounded-l-md ${o.value ? 'bg-primary' : 'bg-transparent'}`}>
          Yes
        </span>
        <span
          onClick={() => o.onChange(false)}
          className={`w-1/2 text-center rounded-r-md ${
            !o.value ? 'bg-primary' : 'bg-transparent'
          }`}>
          No
        </span>
      </div>
    );
  };

  const renderFields = () => {
    return options.map((o) => (
      <div key={o.label} className="flex w-full justify-between items-center mt-2">
        <span className="text-white text-xs flex justify-center items-center">
          {o.label}
          {o.hint && o.hint}
        </span>
        <div className={cx('rounded-md w-3/5 h-6 text-primary', styles.valueBox)}>
          {renderValueBox(o)}
        </div>
      </div>
    ));
  };

  return (
    <div className={cx('w-full', styles.infoCollapse, className)}>
      <Antd.Collapse
        defaultActiveKey={showCollapse ? ['1'] : []}
        className={cx('w-full rounded-md', styles.collapse)}
        expandIconPosition="right"
        bordered={false}
        expandIcon={({ isActive }) => (
          <CaretDownOutlined style={{ fontSize: '1rem' }} rotate={isActive ? 180 : 0} />
        )}>
        <Antd.Collapse.Panel header={title} key="1">
          {renderFields()}
        </Antd.Collapse.Panel>
      </Antd.Collapse>
    </div>
  );
};

export default Collapse;
