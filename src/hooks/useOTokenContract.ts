import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionReceipt } from 'web3-core';
import { OToken, TxnCallbacks } from '@konomi-network/client';
import { getOTokenAbi } from 'modules/connection/reducer';
import { getBlocksConfirmation } from 'modules/common/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import transactionsActions from 'modules/transactions/actions';
import useActiveWeb3React from './useActiveWeb3React';

export type OTokenMethods = 'supply' | 'borrow' | 'withdraw' | 'repay';

const useOTokenContract = (oTokenAddress: string) => {
  const { library } = useActiveWeb3React();
  const dispatch = useDispatch();
  const confirmations = useSelector(getBlocksConfirmation);
  const oTokenAbi = useSelector(getOTokenAbi);
  const selectedAccount = useSelector(getSelectedAccount);
  const [oToken, setOToken] = useState<OToken | null>(null);

  const callbacks = useCallback(
    (onEnd?: () => any): TxnCallbacks => [
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
          if (onEnd) onEnd();
          dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
        }
      }
    ],
    [dispatch]
  );

  const supply = useCallback(
    (value: string, onReload?: () => any) => {
      if (oToken) return oToken.mint(value, { confirmations }, ...callbacks(onReload));
    },
    [callbacks, confirmations, oToken]
  );

  const borrow = useCallback(
    (value: string, onReload?: () => any) => {
      if (oToken) return oToken.borrow(value, { confirmations }, ...callbacks(onReload));
    },
    [callbacks, confirmations, oToken]
  );

  const withdraw = useCallback(
    (value: string, onReload?: () => any) => {
      if (oToken) return oToken.redeemUnderlying(value, { confirmations }, ...callbacks(onReload));
    },
    [callbacks, confirmations, oToken]
  );

  const repay = useCallback(
    (value: string, onReload?: () => any) => {
      if (oToken) return oToken.repayBorrow(value, { confirmations }, ...callbacks(onReload));
    },
    [callbacks, confirmations, oToken]
  );

  const oceanMasterWithdrawAll = useCallback(
    (onReload?: () => any) => {
      if (oToken) return oToken.oceanMasterWithdraw({ confirmations }, ...callbacks(onReload));
    },
    [callbacks, confirmations, oToken]
  );

  useEffect(() => {
    if (library && selectedAccount)
      setOToken(new OToken(library!, oTokenAbi, oTokenAddress, selectedAccount!, {} as any));
  }, [selectedAccount, library, oTokenAbi, oTokenAddress]);

  return {
    supply,
    borrow,
    withdraw,
    repay,
    oceanMasterWithdrawAll
  };
};

export default useOTokenContract;
