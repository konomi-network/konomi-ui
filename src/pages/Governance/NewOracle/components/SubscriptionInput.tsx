import { useSelector } from 'react-redux';
import { Selector } from 'components';
import { getAggregationStrategies } from 'modules/common/reducer';

type TProps = {
  className?: string;
  highlightMissingField: boolean;
  aggregateStrategy: number;
  leasePeriodOptions: any[];
  onChooseLeasePeriod: (...args: any) => {} | void;
  setAggregateStrategy: (...args: any) => {} | void;
};

const DataSourceInput: React.FC<TProps> = ({
  aggregateStrategy,
  setAggregateStrategy,
  highlightMissingField,
  leasePeriodOptions,
  onChooseLeasePeriod
}) => {
  const aggregationStrategies = useSelector(getAggregationStrategies);
  return (
    <div className="flex w-full mt-1">
      <div className="w-60 relative">
        <div className="absolute w-6 h-0.5 left-0 top-[7px] bg-[#00d7d7]"></div>
        <div className="absolute left-[26px] top-0 text-xs font-medium">
          Provide Subscription Info
        </div>
      </div>
      <div className="flex flex-col w-full justify-between py-[26px] px-8 h-[130px] rounded bg-[#00D7D7] bg-opacity-10">
        <div className="flex">
          <div className="w-[210px] text-white text-left">Aggregation Strategy</div>
          <div className="flex rounded border border-primary overflow-hidden">
            {aggregationStrategies.map((item) => (
              <div
                key={item.value}
                className={`py-0.5 w-[125px] cursor-pointer text-primary bg-transparent ${
                  aggregateStrategy === +item.value
                    ? 'text-[#221334] bg-primary text-md font-bold'
                    : ''
                }`}
                onClick={() => {
                  setAggregateStrategy(+item.value);
                }}>
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <div className="w-[210px] text-white text-left">Lease Period</div>
          <div className="w-[250px]">
            {leasePeriodOptions && (
              <Selector
                options={leasePeriodOptions}
                placeholder={
                  highlightMissingField ? (
                    <div className="text-[#ff0000]">Choose Lease Period</div>
                  ) : (
                    <div className="text-[#0b98a3]">Choose Lease Period</div>
                  )
                }
                className="text-primary bold"
                onChange={onChooseLeasePeriod}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSourceInput;
