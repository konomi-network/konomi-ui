import { useEffect, useCallback } from 'react';
import { batch, useDispatch, useSelector } from 'react-redux';
import { KonomiGovernor, OceanLending, ProposalFactory } from '@konomi-network/client';

import {
  getStakingAbi,
  getKonoAbi,
  getOracleAbi,
  getJumpInterestV2Abi,
  getOceanLendingAbi,
  getOceanLendingAddresses,
  getGovernorAbi,
  getGovernorAddresses
} from 'modules/connection/reducer';
import { RootState } from 'modules/rootReducer';
import { getSelectedAccount } from 'modules/account/reducer';
import connectionAction from 'modules/connection/actions';
import useActiveWeb3React from './useActiveWeb3React';

const useInitContracts = () => {
  const { error, library, chainId } = useActiveWeb3React();
  const dispatch = useDispatch();
  const selectedAccount = useSelector(getSelectedAccount);
  const stakingAbi = useSelector(getStakingAbi);
  const konoAbi = useSelector(getKonoAbi);
  const oracleAbi = useSelector(getOracleAbi);
  const governorAbi = useSelector(getGovernorAbi);
  const jumpInterestV2Abi = useSelector(getJumpInterestV2Abi);
  const oceanLendingAbi = useSelector(getOceanLendingAbi);

  const oceanLendingAddresses = useSelector(getOceanLendingAddresses);
  const stakingAddresses = useSelector((state: RootState) => state.connection.stakingAddresses);
  const konoAddresses = useSelector((state: RootState) => state.connection.konoAddresses);
  const oracleAddresses = useSelector((state: RootState) => state.connection.oracleAddresses);
  const governorAddresses = useSelector(getGovernorAddresses);

  const setCurrentContractAddress = useCallback(
    (payload: any) => dispatch(connectionAction.SET_CURRENT_ADDRESS(payload)),
    [dispatch]
  );

  const setNetworkId = useCallback(
    (payload: any) => {
      dispatch(connectionAction.SET_NETWORK_ID(payload));
    },
    [dispatch]
  );

  const setContracts = useCallback(
    (payload: any) => {
      dispatch(connectionAction.SET_CONTRACTS(payload));
    },
    [dispatch]
  );

  useEffect(() => {
    if (!konoAbi || !oracleAbi || !governorAbi || !stakingAbi || !oceanLendingAbi) {
      return;
    }

    if (!error && library && chainId && selectedAccount) {
      const connectedChainId = chainId;
      // Oracle Network
      const oracleNetwork =
        oracleAddresses.find((result: any) => result.chainId === connectedChainId) ||
        oracleAddresses[0];
      const oracleAddress = oracleNetwork?.address || '';
      const oracleSubscriptionContract = new library.eth.Contract(oracleAbi, oracleAddress);

      // Konomi Network
      const konoNetwork =
        konoAddresses.find((result: any) => result.chainId === connectedChainId) ||
        konoAddresses[0];
      const konoAddress = konoNetwork?.address || '';
      const konoContract = new library.eth.Contract(konoAbi, konoAddress);

      // Staking
      const stakingNetwork =
        stakingAddresses.find((result: any) => result.chainId === connectedChainId) ||
        stakingAddresses[0];
      const stakingAddress = stakingNetwork?.address || '';
      const stakingContract = new library.eth.Contract(stakingAbi, stakingAddress);

      // OceanLending
      const oceanLendingNetwork =
        oceanLendingAddresses.find((result: any) => result.chainId === connectedChainId) ||
        oceanLendingAddresses[0];
      const oceanLendingAddress = oceanLendingNetwork?.address || '';
      const oceanLendingContract = new OceanLending(
        library,
        oceanLendingAbi,
        oceanLendingAddress,
        selectedAccount
      );

      // Governor Network
      const governorNetwork =
        governorAddresses.find((result: any) => result.chainId === connectedChainId) ||
        governorAddresses[0];
      const governorAddress = governorNetwork?.address || '';

      const governorContract = new KonomiGovernor(
        { oceanLending: oceanLendingContract.address, oracle: oracleAddress },
        library,
        governorAbi,
        governorAddress,
        selectedAccount,
        new ProposalFactory(library)
      );

      batch(() => {
        // update contracts obj
        setContracts({
          oracleSubscriptionContract,
          governorContract,
          konoContract,
          stakingContract,
          oceanLendingContract
        });
        // update contract address
        setCurrentContractAddress({
          currentStakingAddress: stakingAddress,
          currentKonoAddress: konoAddress,
          currentOracleAddress: oracleAddress
        });
        // update network Id.
        setNetworkId(konoNetwork.networkId);
      });
    }
  }, [
    error,
    library,
    chainId,
    stakingAbi,
    konoAbi,
    oracleAbi,
    jumpInterestV2Abi,
    oceanLendingAbi,
    stakingAddresses,
    oceanLendingAddresses,
    konoAddresses,
    oracleAddresses,
    selectedAccount,
    governorAbi,
    governorAddresses,
    setCurrentContractAddress,
    setNetworkId,
    setContracts
  ]);
};

export default useInitContracts;
