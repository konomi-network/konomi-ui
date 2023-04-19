import { Selector } from 'components';

type TProps = {
  options?: any[];
  onChange: (input: any) => any;
};

const StatusSelect: React.FC<TProps> = ({ options, onChange }) => {
  return (
    <div className="w-1/3">
      <Selector options={options} onChange={onChange} placeholder="Filter By Status" />
    </div>
  );
};

export default StatusSelect;
