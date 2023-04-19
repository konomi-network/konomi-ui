import { useDispatch, useSelector } from 'react-redux';
import { useState, useCallback } from 'react';
import useIsMounted from './useIsMounted';
import { getSelectedAccount } from 'modules/account/reducer';
import { getCurrentNetworkId, getStakingContract } from 'modules/connection/reducer';
import { calculateStakingAPR, convertBNtoTokens, convertToHex } from 'utils/web3';
import { getBlocksConfirmation, getSupportedNetworkMap } from 'modules/common/reducer';
import transactionsActions from 'modules/transactions/actions';
import useActiveWeb3React from './useActiveWeb3React';
import { getBlockTime } from 'modules/common/reducer';
import { getTimeFromBlock } from 'utils/web3';

const useStakingContract = () => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();
  const { library } = useActiveWeb3React();
  const supportedNetworkMap = useSelector(getSupportedNetworkMap);
  const networkId = useSelector(getCurrentNetworkId);
  const stakingContract = useSelector(getStakingContract);
  const selectedAccount = useSelector(getSelectedAccount);
  const blocksConfirmMax = useSelector(getBlocksConfirmation);
  const blockTime = useSelector(getBlockTime);
  const [isEnded, setIsEnded] = useState(false);
  const [isCheckingEnd, setIsCheckingEnd] = useState(true);

  const [stakingEndTimeString, setStakingEndTimeString] = useState('');
  const [apr, setApr] = useState(0);
  const [maxDeposit, setMaxDeposit] = useState(0);
  const [minDeposit, setMinDeposit] = useState(0);
  const [userDeposit, setUserDeposit] = useState(0);
  const [userReward, setUserReward] = useState(0);
  const [rewardInPool, setRewardInPool] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentTotalDeposit, setCurrentTotalDeposit] = useState(0);

  const checkEndTime = useCallback(async () => {
    if (stakingContract && library) {
      setIsCheckingEnd(true);
      const currentBlock = await library?.eth.getBlockNumber();
      stakingContract.methods
        .stakingEndTime()
        .call()
        .then((endBlock: number) => {
          const blockNumberDiff = endBlock - currentBlock;
          const stakingEndTimeData = getTimeFromBlock(blockNumberDiff, blockTime);
          if (isMounted()) {
            setStakingEndTimeString(stakingEndTimeData);
            setIsCheckingEnd(false);
            if (currentBlock >= endBlock) {
              setIsEnded(true);
            } else {
              setIsEnded(false);
            }
          }
        });
    }
  }, [stakingContract, library, blockTime, isMounted]);

  const getApr = useCallback(
    (cb?: (input: number) => any) => {
      if (stakingContract && networkId !== undefined) {
        stakingContract.methods
          .rewardPerBlock()
          .call()
          .then((result: number | string) => {
            if (isMounted()) {
              const aprResult = calculateStakingAPR(
                supportedNetworkMap[networkId].blockTime,
                result
              );
              setApr(aprResult);
              if (cb) cb(aprResult);
            }
          });
      }
    },
    [isMounted, networkId, supportedNetworkMap, stakingContract]
  );

  const getCurrentTotalDeposit = useCallback(() => {
    if (stakingContract) {
      stakingContract.methods
        .totalDeposit()
        .call()
        .then((result: number) => {
          if (isMounted()) {
            setCurrentTotalDeposit(convertBNtoTokens(result));
          }
        });
    }
  }, [stakingContract, isMounted]);

  const getMaxDeposit = useCallback(() => {
    if (stakingContract) {
      stakingContract.methods
        .maxDeposit()
        .call()
        .then((result: number) => {
          if (isMounted()) {
            setMaxDeposit(convertBNtoTokens(result));
          }
        });
    }
  }, [stakingContract, isMounted]);

  const getRewardInPool = useCallback(() => {
    if (stakingContract) {
      stakingContract.methods
        .totalReward()
        .call()
        .then((result: number) => {
          if (isMounted()) {
            setRewardInPool(convertBNtoTokens(result));
          }
        });
    }
  }, [stakingContract, setRewardInPool, isMounted]);

  const getMinDeposit = useCallback(
    (cb?: (value: number) => void) => {
      if (stakingContract) {
        stakingContract.methods
          .minDepositAmount()
          .call()
          .then((result: number) => {
            if (isMounted()) {
              let resultInEther = convertBNtoTokens(result);
              if (
                currentTotalDeposit &&
                maxDeposit &&
                maxDeposit - currentTotalDeposit < resultInEther
              ) {
                resultInEther = maxDeposit - currentTotalDeposit;
              }
              setMinDeposit(resultInEther);
              if (cb) cb(resultInEther);
            }
          });
      }
    },
    [isMounted, stakingContract, currentTotalDeposit, maxDeposit]
  );

  const getStakingInfo = useCallback(
    (cb?: (value?: any) => {} | void) => {
      if (stakingContract && selectedAccount) {
        stakingContract.methods
          .getUserStake(selectedAccount.address)
          .call()
          .then((result: { [key: number]: number }) => {
            if (isMounted()) {
              const depositAmount = convertBNtoTokens(result[0]);
              const rewardAmount = convertBNtoTokens(result[1]);
              setUserDeposit(depositAmount);
              setUserReward(rewardAmount);
              if (cb) cb(depositAmount + rewardAmount);
            }
          });
      }
    },
    [stakingContract, selectedAccount, isMounted]
  );

  const deposit = useCallback(
    (amount: number | string, cb?: () => void) => {
      if (stakingContract && selectedAccount) {
        const hexAmount = convertToHex(amount);
        setIsSubmitting(true);
        stakingContract.methods
          .deposit(hexAmount)
          .send({ from: selectedAccount?.address })
          .on('transactionHash', (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          })
          .on('confirmation', async (confirmation: any, receipt: any) => {
            if (confirmation === blocksConfirmMax) {
              if (isMounted()) {
                setIsSubmitting(false);
              }
              if (receipt.status) {
                if (cb) cb();
                dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
              } else {
                dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
              }
            }
          })
          .on('error', (error: Error, receipt: any) => {
            if (isMounted()) {
              setIsSubmitting(false);
            }
            if (receipt && !receipt.status) {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          });
      }
    },
    [stakingContract, selectedAccount, blocksConfirmMax, dispatch, isMounted]
  );

  const withdraw = useCallback(
    (amount: number | string, cb?: () => void) => {
      if (stakingContract && selectedAccount) {
        const hexAmount = convertToHex(amount);
        setIsSubmitting(true);
        stakingContract.methods
          .withdraw(hexAmount)
          .send({ from: selectedAccount?.address })
          .on('transactionHash', (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          })
          .on('confirmation', async (confirmation: any, receipt: any) => {
            if (confirmation === blocksConfirmMax) {
              if (isMounted()) {
                setIsSubmitting(false);
              }
              if (receipt.status) {
                if (cb) cb();
                dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
              } else {
                dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
              }
            }
          })
          .on('error', (error: Error, receipt: any) => {
            if (isMounted()) {
              setIsSubmitting(false);
            }
            if (receipt && !receipt.status) {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          });
      }
    },
    [stakingContract, selectedAccount, blocksConfirmMax, dispatch, isMounted]
  );

  const withdrawAll = useCallback(
    (cb?: () => void) => {
      if (stakingContract && selectedAccount) {
        setIsSubmitting(true);
        stakingContract.methods
          .withdrawAll()
          .send({ from: selectedAccount?.address })
          .on('transactionHash', (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          })
          .on('confirmation', async (confirmation: any, receipt: any) => {
            if (confirmation === blocksConfirmMax) {
              if (isMounted()) {
                setIsSubmitting(false);
              }
              if (receipt.status) {
                if (cb) cb();
                dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
              } else {
                dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
              }
            }
          })
          .on('error', (error: Error, receipt: any) => {
            if (isMounted()) {
              setIsSubmitting(false);
            }
            if (receipt && !receipt.status) {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          });
      }
    },
    [stakingContract, selectedAccount, blocksConfirmMax, dispatch, isMounted]
  );

  return {
    isSubmitting,
    stakingEndTimeString,
    isEnded,
    isCheckingEnd,
    rewardInPool,
    userDeposit,
    userReward,
    minDeposit,
    maxDeposit,
    currentTotalDeposit,
    apr,
    getMaxDeposit,
    getMinDeposit,
    getStakingInfo,
    getRewardInPool,
    getCurrentTotalDeposit,
    deposit,
    withdraw,
    withdrawAll,
    checkEndTime,
    getApr
  };
};

export default useStakingContract;
