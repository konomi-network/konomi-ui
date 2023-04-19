import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getKonoContract } from 'modules/connection/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { convertBNtoTokens } from 'utils/web3';
import useIsMounted from './useIsMounted';

const useKonoBalance = () => {
  const [balance, setBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const konoContract = useSelector(getKonoContract);
  const selectedAccount = useSelector(getSelectedAccount);
  const isMounted = useIsMounted();

  const getBalance = useCallback(
    (cb?: (input: number) => any) => {
      if (konoContract && selectedAccount) {
        setIsLoading(true);
        konoContract.methods
          .balanceOf(selectedAccount.address)
          .call()
          .then((result: number | string) => {
            if (isMounted()) {
              setIsLoading(false);
              setBalance(convertBNtoTokens(result));
              if (cb) cb(convertBNtoTokens(result));
            }
          });
      }
    },
    [konoContract, selectedAccount, isMounted]
  );

  return { balance, getBalance, isLoading };
};

export default useKonoBalance;
