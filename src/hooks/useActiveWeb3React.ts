import { useEffect, useState, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3ReactContextInterface } from '@web3-react/core/dist/types';
import Web3 from 'web3';

// TODO: listening for more dynamic providers in future
const useActiveWeb3React = (): Web3ReactContextInterface<Web3> => {
  const { library, ...web3React } = useWeb3React();
  const refEth = useRef(library);
  const [provider, setProvider] = useState(library);

  useEffect(() => {
    if (library !== refEth.current) {
      setProvider(library);
      refEth.current = library;
    }
  }, [library]);

  return {
    library: provider,
    ...web3React
  };
};

export default useActiveWeb3React;
