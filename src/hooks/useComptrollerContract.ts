import { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionReceipt } from 'web3-core';
import { Comptroller, TxnCallbacks } from '@konomi-network/client';

import { getBlocksConfirmation } from 'modules/common/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { getComptrollerAbi } from 'modules/connection/reducer';
import transactionsActions from 'modules/transactions/actions';

import useActiveWeb3React from './useActiveWeb3React';

const useComptrollerContract = (comptrollerAddress: string) => {
  const { library } = useActiveWeb3React();
  const dispatch = useDispatch();
  const confirmations = useSelector(getBlocksConfirmation);
  const comptrollerAbi = useSelector(getComptrollerAbi);
  const selectedAccount = useSelector(getSelectedAccount);
  const [comptrollerContract, setComptrollerContract] = useState<Comptroller | null>(null);

  const callbacks = useCallback(
    (onEnd?: (error?: any) => any): TxnCallbacks => [
      (txnHash: string) => {
        dispatch(transactionsActions.SET_PENDING(txnHash));
      },
      (receipt: TransactionReceipt) => {
        if (receipt.status) {
          dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
        } else {
          dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
        }
        if (onEnd) onEnd();
      },
      (error: Error, receipt: TransactionReceipt) => {
        if (receipt && !receipt.status) {
          if (onEnd) onEnd(error);
          dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
        }
      }
    ],
    [dispatch]
  );

  const checkMembership = useCallback(
    async (tokenAddress: string) => {
      if (comptrollerContract && selectedAccount) {
        const result = await comptrollerContract.checkMembership(
          selectedAccount?.address,
          tokenAddress
        );
        return result;
      }
    },
    [comptrollerContract, selectedAccount]
  );

  const getAssetsIn = useCallback(async () => {
    if (comptrollerContract && selectedAccount) {
      const result = await comptrollerContract.getAssetsIn(selectedAccount?.address);
      return result;
    }
  }, [comptrollerContract, selectedAccount]);

  const enterMarkets = useCallback(
    async (tokenAddresses: string[], onEnd?: (error: any) => void) => {
      if (comptrollerContract) {
        return comptrollerContract.enterMarkets(
          tokenAddresses,
          { confirmations },
          ...callbacks(onEnd)
        );
      }
    },
    [callbacks, comptrollerContract, confirmations]
  );

  useEffect(() => {
    if (library && selectedAccount && comptrollerAbi && comptrollerAddress)
      setComptrollerContract(
        new Comptroller(library, comptrollerAbi, comptrollerAddress, selectedAccount)
      );
  }, [comptrollerAbi, comptrollerAddress, library, selectedAccount]);

  return {
    getAssetsIn,
    checkMembership,
    enterMarkets
  };
};

export default useComptrollerContract;
