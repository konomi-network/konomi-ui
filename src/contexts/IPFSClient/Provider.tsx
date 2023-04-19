import { DecentralizedFileStorage } from '@konomi-network/decentralized-fs';
import { createContext } from 'react';
import { DOMAIN_URL } from 'config/settings';

type ContextType = DecentralizedFileStorage;

type TProps = {
  children: any;
};
const ipfsUrl = DOMAIN_URL.ipfs;
const IPFSClientContext = createContext<ContextType>(new DecentralizedFileStorage(ipfsUrl));
const IPFSClientProvider: React.FC<TProps> = ({ children }: TProps) => {
  const instance = new DecentralizedFileStorage(ipfsUrl);
  return <IPFSClientContext.Provider value={instance}>{children}</IPFSClientContext.Provider>;
};

export { IPFSClientContext, IPFSClientProvider };
