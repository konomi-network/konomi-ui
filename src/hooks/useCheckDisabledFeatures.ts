import { getDisabledFeatures } from 'modules/common/reducer';
import { getCurrentNetworkId } from 'modules/connection/reducer';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const useCheckDisabledFeatures = () => {
  const networkId = useSelector(getCurrentNetworkId);
  const disabledFeatures = useSelector(getDisabledFeatures);

  /** Path feature disabled based on the network id setting from backend */
  const isDisabledFeature = useCallback(
    (path: string) =>
      !!Object.keys(disabledFeatures).find(
        (key) =>
          typeof networkId === 'number' && key === path && disabledFeatures[key].includes(networkId)
      ),
    [disabledFeatures, networkId]
  );

  return { isDisabledFeature };
};

export default useCheckDisabledFeatures;
