import { useSelector } from 'react-redux';
import { SupportedChainId } from 'config/chains';
import { getSelectedAccount } from 'modules/account/reducer';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { BscIcon, EthereumIcon, PolygonIcon } from '../icons';

const NetworkLogo = () => {
  const { chainId } = useActiveWeb3React();
  const selectedAccount = useSelector(getSelectedAccount);

  const renderIcon = () => {
    switch (chainId) {
      case SupportedChainId.ETHEREUM_MAINNET:
        return <EthereumIcon />;
      case SupportedChainId.BSC:
      case SupportedChainId.BSC_TESTNET:
        return <BscIcon />;
      case SupportedChainId.POLYGON:
      case SupportedChainId.POLYGON_MUMBAI:
        return <PolygonIcon />;
      default:
        return null;
    }
  };

  if (selectedAccount)
    return (
      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white">
        {renderIcon()}
      </div>
    );
  return null;
};

export default NetworkLogo;
