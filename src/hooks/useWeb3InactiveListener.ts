import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getInjectedConnector } from 'utils/web3';
import { getSupportedChainIds } from 'modules/common/reducer';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

function useWeb3InactiveListener(suppress = false) {
  const { active, error, activate } = useActiveWeb3React(); // specifically using useWeb3React because of what this hook does
  const supportedChainIds = useSelector(getSupportedChainIds);

  const injected = useMemo(() => getInjectedConnector(supportedChainIds), [supportedChainIds]);

  useEffect(() => {
    const { ethereum } = window;

    if (ethereum && ethereum.on && !active && !error && !suppress) {
      const handleChainChanged = () => {
        activate(injected);
      };

      const handleAccountsChanged = (accounts: string | any[]) => {
        if (accounts.length > 0) {
          activate(injected, undefined, true).catch((e) => {
            console.error('Failed to activate after accounts changed', e);
          });
        }
      };

      ethereum.on('chainChanged', handleChainChanged);
      ethereum.on('accountsChanged', handleAccountsChanged);

      return () => {
        if (ethereum.removeListener) {
          ethereum.removeListener('chainChanged', handleChainChanged);
          ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [active, error, activate, injected, suppress]);
}

export default useWeb3InactiveListener;
