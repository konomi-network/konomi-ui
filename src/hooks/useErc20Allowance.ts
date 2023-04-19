import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TransactionReceipt } from 'web3-core';
import { ERC20Token } from '@konomi-network/client';

import { convertToHex, convertToEtherValue } from 'utils/web3';
import erc20Abi from 'abi/erc20.json';
import { getSelectedAccount } from 'modules/account/reducer';
import { getBlocksConfirmation } from 'modules/common/reducer';
import transactionsActions from 'modules/transactions/actions';
import useIsMounted from './useIsMounted';
import useActiveWeb3React from './useActiveWeb3React';

const DEFAULT_ALLOWANCE_VALUE = 9999999;

const useErc20Allowance = (oTokenAddress: string, erc20Address: string) => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const { library } = useActiveWeb3React();
  const confirmations = useSelector(getBlocksConfirmation);
  const selectedAccount = useSelector(getSelectedAccount);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [allowance, setAllowance] = useState(0);
  const [erc20Contract, setErc20Contract] = useState<ERC20Token | null>(null);

  const getAllowance = useCallback(() => {
    if (selectedAccount?.address && erc20Contract && oTokenAddress) {
      erc20Contract.allowance(selectedAccount.address, oTokenAddress).then((result: string) => {
        if (isMounted()) {
          if (result && +result > 0) {
            setAllowance(+convertToEtherValue(result));
          } else {
            setAllowance(0);
          }
        }
      });
    }
  }, [oTokenAddress, selectedAccount, erc20Contract, isMounted]);

  const onClickIncreaseAllowance = useCallback(
    (amount: number = DEFAULT_ALLOWANCE_VALUE) => {
      if (selectedAccount && erc20Contract) {
        setIsIncreasing(true);
        const hexValue = convertToHex(amount);
        erc20Contract.increaseAllowance(
          oTokenAddress,
          hexValue,
          { confirmations },
          (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          },
          (receipt: TransactionReceipt) => {
            if (isMounted()) {
              getAllowance();
              setIsIncreasing(false);
            }
            if (receipt.status) {
              dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
            } else {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          },
          (error: Error, receipt: TransactionReceipt) => {
            if (isMounted()) {
              setIsIncreasing(false);
            }
            if (receipt && !receipt.status) {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          }
        );
      }
    },
    [
      dispatch,
      isMounted,
      getAllowance,
      oTokenAddress,
      selectedAccount,
      confirmations,
      erc20Contract
    ]
  );

  const onClickApprove = useCallback(
    (amount: number = DEFAULT_ALLOWANCE_VALUE) => {
      if (selectedAccount && erc20Contract) {
        setIsIncreasing(true);
        const hexValue = convertToHex(amount);
        erc20Contract.approve(
          oTokenAddress,
          hexValue,
          { confirmations },
          (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          },
          (receipt: TransactionReceipt) => {
            if (isMounted()) {
              getAllowance();
              setIsIncreasing(false);
            }
            if (receipt.status) {
              dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
            } else {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          },
          (error: Error, receipt: TransactionReceipt) => {
            if (isMounted()) {
              setIsIncreasing(false);
            }
            if (receipt && !receipt.status) {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          }
        );
      }
    },
    [
      dispatch,
      isMounted,
      getAllowance,
      oTokenAddress,
      selectedAccount,
      confirmations,
      erc20Contract
    ]
  );

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  useEffect(() => {
    if (library && selectedAccount)
      setErc20Contract(new ERC20Token(library, erc20Abi, erc20Address, selectedAccount));
  }, [erc20Address, selectedAccount, library]);

  return {
    isIncreasing,
    erc20Contract,
    allowance,
    setAllowance,
    onClickApprove,
    onClickIncreaseAllowance
  };
};

export default useErc20Allowance;
