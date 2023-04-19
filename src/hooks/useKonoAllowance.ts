import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedAccount } from 'modules/account/reducer';
import { getBlocksConfirmation } from 'modules/common/reducer';
import transactionsActions from 'modules/transactions/actions';
import { getKonoContract } from 'modules/connection/reducer';
import useIsMounted from './useIsMounted';
import { convertToHex, convertToEtherValue } from 'utils/web3';

const useKonoAllowance = (address?: string) => {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const konoContract = useSelector(getKonoContract);
  const blocksConfirmMax = useSelector(getBlocksConfirmation);
  const selectedAccount = useSelector(getSelectedAccount);
  const [allowance, setAllowance] = useState(0);
  const [isIncreasing, setIsIncreasing] = useState(false);

  const getAllowance = useCallback(() => {
    if (selectedAccount?.address && konoContract && address) {
      konoContract.methods
        .allowance(selectedAccount.address, address)
        .call()
        .then((result: any) => {
          if (isMounted()) {
            if (result && result > 0) {
              setAllowance(+convertToEtherValue(result));
            } else {
              setAllowance(0);
            }
          }
        });
    }
  }, [address, selectedAccount, konoContract, isMounted]);

  const onClickIncreaseAllowance = useCallback(
    (amount?: number) => {
      if (selectedAccount && konoContract && address) {
        const defaultAllowance = 9999999;
        const calculatedApproveValue = convertToHex(
          amount && amount > defaultAllowance ? amount : defaultAllowance
        );
        setIsIncreasing(true);
        konoContract.methods
          .increaseAllowance(address, calculatedApproveValue)
          .send({ from: selectedAccount.address })
          .on('transactionHash', (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          })
          .on('confirmation', (confirmation: any, receipt: any) => {
            if (confirmation === blocksConfirmMax) {
              if (isMounted()) {
                setIsIncreasing(false);
                getAllowance();
              }
              if (receipt.status) {
                dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
              } else {
                dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
              }
            }
          })
          .on('error', (error: Error, receipt: any) => {
            if (isMounted()) {
              setIsIncreasing(false);
            }
            if (receipt && !receipt.status) {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          });
      }
    },
    [selectedAccount, konoContract, blocksConfirmMax, dispatch, isMounted, getAllowance, address]
  );

  useEffect(() => {
    getAllowance();
  }, [getAllowance]);

  return {
    isIncreasing,
    allowance,
    setAllowance,
    onClickIncreaseAllowance
  };
};

export default useKonoAllowance;
