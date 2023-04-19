import { useSelector } from 'react-redux';
import { getAggregationStrategyMap } from 'modules/common/reducer';

const useAggregationStrategy = (aggregationStrategy: number | undefined) => {
  const aggregationMap = useSelector(getAggregationStrategyMap);
  const aggregationStrategyName =
    aggregationStrategy === undefined ? '' : aggregationMap[aggregationStrategy];

  return {
    aggregationStrategyName
  };
};

export default useAggregationStrategy;
