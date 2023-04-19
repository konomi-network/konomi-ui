import { useEffect, useCallback } from 'react';
import { batch, connect, useDispatch } from 'react-redux';
import { useCookies } from 'react-cookie';
import { UnsupportedChainIdError } from '@web3-react/core';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import accountAction from 'modules/account/actions';
import connectionAction from 'modules/connection/actions';
import oracleActions from 'modules/oracles/actions';
import commonActions from 'modules/common/actions';
import { getNetworkError } from 'modules/common/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { RootState } from 'modules/rootReducer';

import useInitContracts from 'hooks/useInitContracts';
import { ConnectWalletModal, ConnectSection, ConnectedDropdownMenu } from './components';
import useListenSubscribedOracles from 'hooks/useListenSubscribedOracles';

const WalletConnector: React.FC = (props: any) => {
  const {
    setNetworkId,
    setSelectedAccount,
    selectedAccount,
    setMySubscriptions,
    setContracts,
    networkError
  } = props;
  useInitContracts();
  useListenSubscribedOracles();

  const dispatch = useDispatch();
  const { library, deactivate, active, error, account } = useActiveWeb3React();
  const [, setCookie, removeCookie] = useCookies(['AccountAddress']);

  const toggleConnectModal = useCallback(() => {
    dispatch(commonActions.TOGGLE_WALLET_CONNECTOR(true));
  }, [dispatch]);

  const handleDisconnect = useCallback(() => {
    deactivate();
    // clear cookie
    removeCookie('AccountAddress');
    // clear UI
    batch(() => {
      setSelectedAccount(null);
      setMySubscriptions([]);
      setNetworkId(undefined);
      setContracts({
        oracleSubscriptionContract: null,
        governorContract: null,
        konoContract: null,
        oceanLendingContract: null,
        stakingContract: null
      });
    });
  }, [
    setNetworkId,
    setMySubscriptions,
    setContracts,
    setSelectedAccount,
    deactivate,
    removeCookie
  ]);

  useEffect(() => {
    if (error instanceof UnsupportedChainIdError) {
      if (!networkError) dispatch(commonActions.SET_NETWORK_ERROR(true));
      if (selectedAccount) handleDisconnect();
      return;
    }
    if (active && library) {
      setSelectedAccount({ address: account });
      setCookie('AccountAddress', account, { path: '/' });
      dispatch(commonActions.SET_NETWORK_ERROR(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, error, setSelectedAccount, library, account, setCookie, dispatch, handleDisconnect]);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum?.on && active) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          const currentAccount = accounts[0];
          setSelectedAccount({ address: currentAccount });
          setCookie('AccountAddress', currentAccount, { path: '/' });
        }
      };
      ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [active, setSelectedAccount, setCookie]);

  return (
    <div className="relative flex justify-end items-center h-full w-[194px] leading-4 ml-4">
      {!!account ? (
        <ConnectedDropdownMenu onDisconnect={handleDisconnect} address={selectedAccount?.address} />
      ) : (
        <ConnectSection toggleConnectModal={toggleConnectModal} />
      )}
      <ConnectWalletModal />
    </div>
  );
};

const mapDispatchToProps = {
  setSelectedAccount: accountAction.SET_SELECTED_ACCOUNT,
  setNetworkId: connectionAction.SET_NETWORK_ID,
  setContracts: connectionAction.SET_CONTRACTS,
  setMySubscriptions: oracleActions.SET_MY_SUBSCRIPTIONS
};

const mapStateToProps = (state: RootState) => ({
  selectedAccount: getSelectedAccount(state),
  networkError: getNetworkError(state)
});

export default connect(mapStateToProps, mapDispatchToProps)(WalletConnector);
