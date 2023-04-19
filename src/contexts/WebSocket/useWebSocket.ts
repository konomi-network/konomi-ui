import { WebSocketContext } from './Provider';
import { useContext } from 'react';

const useWebSocket = () => {
  const instance = useContext(WebSocketContext);
  return instance;
};

export default useWebSocket;
