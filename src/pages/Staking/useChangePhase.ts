import { getCurrentStakingType } from './../../modules/common/reducer';
import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import connectionActions from 'modules/connection/actions';
import commonActions from 'modules/common/actions';
import {
  getStakingAbi,
  getCurrentStakingAddress,
  getStakingContract
} from 'modules/connection/reducer';
import { getStakingTypes, getStakingPhases } from 'modules/common/reducer';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import { areEqualAddresses } from 'utils/web3';

const useChangePhase = () => {
  const dispatch = useDispatch();
  const { library } = useActiveWeb3React();
  const stakingAbi = useSelector(getStakingAbi);
  const currentStakingContract = useSelector(getStakingContract);
  const currentStakingAddress = useSelector(getCurrentStakingAddress);
  const selectedStakingType = useSelector(getCurrentStakingType);
  const stakingTypes = useSelector(getStakingTypes);
  const stakingPhases = useSelector(getStakingPhases);

  const setContracts = useCallback(
    (payload: any) => {
      dispatch(connectionActions.SET_CONTRACTS(payload));
    },
    [dispatch]
  );

  const setCurrentContractAddress = useCallback(
    (payload: any) => dispatch(connectionActions.SET_CURRENT_ADDRESS(payload)),
    [dispatch]
  );

  const handleSelectStakingType = useCallback(
    (payload: string) => {
      dispatch(commonActions.SET_STAKING_TYPE(payload));
    },
    [dispatch]
  );

  const handleSelectPhase = (v: string) => {
    setCurrentContractAddress({
      currentStakingAddress: v
    });
  };

  // when staking type changed > staking phase update > auto select 1st option
  useEffect(() => {
    if (stakingPhases.length > 0) {
      setCurrentContractAddress({
        currentStakingAddress: stakingPhases[0].address
      });
    }
  }, [setCurrentContractAddress, stakingPhases]);

  useEffect(() => {
    if (
      library &&
      stakingAbi &&
      currentStakingAddress &&
      currentStakingContract &&
      !areEqualAddresses(currentStakingAddress, currentStakingContract.options.address)
    ) {
      const stakingContract = new library.eth.Contract(stakingAbi, currentStakingAddress);
      setContracts({
        stakingContract
      });
    }
  }, [library, setContracts, stakingAbi, currentStakingAddress, currentStakingContract]);

  return {
    stakingPhases,
    currentStakingAddress,
    stakingTypes,
    selectedStakingType,
    handleSelectPhase,
    handleSelectStakingType
  };
};

export default useChangePhase;
