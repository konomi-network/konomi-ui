import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useWebSocket } from 'contexts';
import { getSelectedAccount } from 'modules/account/reducer';
import { getSupportedNetworks } from 'modules/common/reducer';
import useActiveWeb3React from 'hooks/useActiveWeb3React';

const useListenSubscribedOracles = () => {
  const socket = useWebSocket();
  const { chainId } = useActiveWeb3React();
  const selectedAccount = useSelector(getSelectedAccount);
  const supportedNetworks = useSelector(getSupportedNetworks);

  useEffect(() => {
    if (
      selectedAccount &&
      socket?.readyState === 1 &&
      chainId !== undefined &&
      supportedNetworks.length > 0
    ) {
      const networkId = supportedNetworks?.find((n) => n?.chainId === chainId)?.id;
      // subscribe to price change
      socket.send(
        JSON.stringify({
          frameType: 'webSocketClientCommandFrame',
          command: 'subscribe',
          payload: {
            networkId,
            user: selectedAccount.address
          }
        })
      );
    }
  }, [socket, supportedNetworks, selectedAccount, chainId]);
};

export default useListenSubscribedOracles;
