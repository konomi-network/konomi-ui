import { createContext, useLayoutEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { DOMAIN_URL } from 'config/settings';
import oracleActions from 'modules/oracles/actions';

const websocketUrl = DOMAIN_URL.websocket;

type ContextType = WebSocket | null;

type TProps = {
  children?: any;
};

const WebSocketContext = createContext<ContextType>(null);

const WebSocketProvider: React.FC<TProps> = ({ children }: TProps) => {
  const dispatch = useDispatch();
  const [currentSocket, setCurrentSocket] = useState<ContextType>(null);

  let count: number = 0;

  const connect = () => {
    const socket = new WebSocket(websocketUrl);
    socket.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log('🚀 websocket connected!');
    };

    socket.onmessage = (evt: any) => {
      let data: any = { payload: [], operation: {}, frameType: '' };
      try {
        // listen to data sent from the websocket server
        data = JSON.parse(evt.data);
      } catch (e) {
        return;
      }

      // combine operation into item data
      const parsedDataWithOperation = data.payload.map((item: any, index: number) => ({
        ...item,
        operation: data.operation[index]
      }));

      // for Oracle -> Currency List tab
      if (data.frameType === 'publicOracleFrame') {
        dispatch(oracleActions.SET_ORACLES(parsedDataWithOperation));
      }
      // for Summary > Oracle tab
      if (data.frameType === 'subscriptionUpdatedFrame') {
        dispatch(oracleActions.SET_MY_SUBSCRIPTIONS(parsedDataWithOperation));
      }
      // for Summary > Oracle tab price data
      if (data.frameType === 'aggFeedUpdatedFrame') {
        dispatch(oracleActions.UPDATE_MY_SUBSCRIPTIONS(parsedDataWithOperation));
      }
    };

    socket.onclose = () => {
      console.log(`Websocket closed, attempt to reconnect websocket in ${count}s`);
      // auto reconnect
      if (count < 5) {
        setTimeout(() => connect(), count * 1000);
      }
    };

    // websocket onerror event listener
    socket.onerror = (err: any) => {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      socket.close();
      count += 1;
    };

    setCurrentSocket(socket);
  };

  useLayoutEffect(() => {
    if (!currentSocket) {
      connect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <WebSocketContext.Provider value={currentSocket}>{children}</WebSocketContext.Provider>;
};

export { WebSocketContext, WebSocketProvider };
