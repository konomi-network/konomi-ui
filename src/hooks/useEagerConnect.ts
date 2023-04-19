import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getInjectedConnector } from 'utils/web3';
import { getSupportedChainIds } from 'modules/common/reducer';
import useActiveWeb3React from './useActiveWeb3React';

function useEagerConnect() {
  const { activate, active } = useActiveWeb3React(); // specifically using useWeb3ReactCore because of what this hook does
  const [tried, setTried] = useState(false);
  const supportedChainIds = useSelector(getSupportedChainIds);

  const injected = useMemo(() => getInjectedConnector(supportedChainIds), [supportedChainIds]);

  useEffect(() => {
    injected
      .isAuthorized()
      .then((isAuthorized: any) => {
        if (isAuthorized || window.ethereum) {
          activate(injected);
        }
      })
      .finally(() => setTried(true));
    // intentionally only running on mount (make sure it's only mounted once :))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if the connection worked, wait until we get confirmation of that to flip the flag
  useEffect(() => {
    if (active) {
      setTried(true);
    }
  }, [active]);

  return tried;
}

export default useEagerConnect;
