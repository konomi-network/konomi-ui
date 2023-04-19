import { IPFSClientContext } from './Provider';
import { useContext } from 'react';

const useIPFSClient = () => {
  const instance = useContext(IPFSClientContext);
  return instance;
};

export default useIPFSClient;
