import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UnsupportedChainIdError } from '@web3-react/core';
import Web3 from 'web3';

import { Antd } from 'components';
import commonActions from 'modules/common/actions';
import { getShowWalletConnector, getSupportedChainIds } from 'modules/common/reducer';

import usePrevious from 'hooks/usePrevious';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useConnector from 'hooks/useConnector';
import { CHAIN_INFO } from 'config/chains';

import { MetamaskIcon, CoinbaseIcon, WalletConnect } from 'resources/icons';
import styles from '../WalletConnector.module.scss';

type TOptionProps = {
  onClick: (...args: any) => void;
  label: string;
};

const Option: React.FC<TOptionProps> = ({ onClick, label }) => {
  const getWalletIcon = () => {
    switch (label) {
      case 'MetaMask':
        return <MetamaskIcon width={24} height={24} />;
      case 'Wallet Connect':
        return <WalletConnect width={24} height={24} />;
      case 'Coinbase Wallet':
        return <CoinbaseIcon width={24} height={24} />;
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className="w-full rounded-lg flex items-end py-4 px-6 mb-3 gap-x-4 bg-optionBg bg-opacity-10 hover:bg-optionBg hover:bg-opacity-30 cursor-pointer transition-all">
      <div>{getWalletIcon()}</div>
      <div className="text-white">{label}</div>
    </div>
  );
};

const ConnectWalletModal = () => {
  const dispatch = useDispatch();
  const { activate, active, connector, error } = useActiveWeb3React();
  const { SUPPORTED_WALLETS, defaultChainRpcUrls } = useConnector();

  const supportedChainIds = useSelector(getSupportedChainIds);
  const showWalletConnector = useSelector(getShowWalletConnector);
  const activePrevious = usePrevious(active);
  const connectorPrevious = usePrevious(connector);

  const defaultChainId = supportedChainIds[0];

  const handleCancel = useCallback(() => {
    if (showWalletConnector) {
      dispatch(commonActions.TOGGLE_WALLET_CONNECTOR(false));
    }
  }, [dispatch, showWalletConnector]);

  useEffect(() => {
    if (
      showWalletConnector &&
      ((active && !activePrevious) || (connector && connector !== connectorPrevious && !error))
    ) {
      handleCancel();
    }
  }, [
    active,
    error,
    connector,
    showWalletConnector,
    activePrevious,
    connectorPrevious,
    handleCancel
  ]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const tryActivation = async (connector: any) => {
    const formattedChainId = Web3.utils.numberToHex(defaultChainId);
    const info = CHAIN_INFO[defaultChainId];

    try {
      await activate(connector, undefined, true);
    } catch (e) {
      if (e instanceof UnsupportedChainIdError) {
        try {
          await window.ethereum?.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: formattedChainId,
                chainName: info.label,
                nativeCurrency: info.nativeCurrency,
                blockExplorerUrls: [info.explorer],
                rpcUrls: defaultChainRpcUrls
              }
            ]
          });
        } catch (_e) {
          console.error(_e);
        }
      }
    }
  };

  const getModalContent = () => {
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key];
      return (
        <Option key={key} label={option.name} onClick={() => tryActivation(option.connector)} />
      );
    });
  };

  return (
    <Antd.Modal
      title="Connect wallet"
      onCancel={handleCancel}
      className={styles.modal}
      visible={showWalletConnector}
      destroyOnClose
      width={400}
      footer={null}>
      {getModalContent()}
      <p className="text-gray-400 font-medium text-center mt-5 mb-5">Having a problem ?</p>
    </Antd.Modal>
  );
};

export default ConnectWalletModal;
