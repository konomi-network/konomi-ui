import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { ERC20Token } from '@konomi-network/client';
import { convertToEtherValue } from 'utils/web3';
import { getSelectedAccount } from 'modules/account/reducer';
import useIsMounted from './useIsMounted';
import useActiveWeb3React from './useActiveWeb3React';
import erc20Abi from 'abi/erc20.json';

const useErc20Contract = (erc20Address: string) => {
  const { library } = useActiveWeb3React();
  const isMounted = useIsMounted();
  const selectedAccount = useSelector(getSelectedAccount);
  const [balance, setBalance] = useState(0);
  const [isBalanceFetching, setIsBalanceFetching] = useState(false);
  const [erc20Contract, setErc20Contract] = useState<ERC20Token | null>(null);

  const getBalance = useCallback(() => {
    if (erc20Contract && selectedAccount) {
      if (isMounted()) {
        setIsBalanceFetching(true);
        erc20Contract
          .balanceOf(selectedAccount.address)
          .then((result) => {
            setBalance(+convertToEtherValue(result));
          })
          .finally(() => {
            setIsBalanceFetching(false);
          });
      }
    }
  }, [erc20Contract, selectedAccount, isMounted]);

  useEffect(() => {
    if (library && selectedAccount)
      setErc20Contract(new ERC20Token(library, erc20Abi, erc20Address, selectedAccount));
  }, [selectedAccount, library, erc20Address]);

  return { balance, isBalanceFetching, getBalance };
};

export default useErc20Contract;
