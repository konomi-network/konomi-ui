import { useSelector } from 'react-redux';
import { getSupportedNetworkMap } from 'modules/common/reducer';
import { getCurrentNetworkId } from 'modules/connection/reducer';

const useExplorerUrls = () => {
  const networkId = useSelector(getCurrentNetworkId);
  const supportedNetworkMap = useSelector(getSupportedNetworkMap);

  const getExploreUrl = () => {
    if (networkId !== undefined) {
      return supportedNetworkMap[networkId].exploreUrl;
    }
  };

  const getTransactionUrl = (hash: string) => {
    if (networkId !== undefined) {
      return `${getExploreUrl()}/tx/${hash}`;
    }
  };

  const getContractUrl = (address: string) => {
    if (networkId !== undefined) {
      return `${getExploreUrl()}/address/${address}`;
    }

    return '';
  };

  return {
    getExploreUrl,
    getTransactionUrl,
    getContractUrl
  };
};

export default useExplorerUrls;
