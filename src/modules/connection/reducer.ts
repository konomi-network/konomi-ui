import { createReducer } from '@reduxjs/toolkit';
import { RootState } from 'modules/rootReducer';
import actions from './actions';
import { Contract } from 'web3-eth-contract';
import { OceanLending, KonomiGovernor } from '@konomi-network/client';

interface ConnectionState {
  oracleSubscriptionContract?: Contract;
  konoContract?: Contract;
  stakingContract?: Contract;
  oceanLendingContract?: OceanLending;
  governorContract?: KonomiGovernor;

  stakingAbi?: any[];
  konoAbi?: any[];
  oracleAbi?: any[];
  jumpInterestV2Abi?: any[];
  comptrollerAbi?: any[];
  oTokenAbi?: any[];
  oceanLendingAbi?: any[];
  governorAbi?: any[];

  stakingAddresses: any[];
  konoAddresses: any[];
  oracleAddresses: any[];
  oceanLendingAddresses: any[];
  governorAddresses: any[];

  currentStakingAddress: string;
  currentKonoAddress: string;
  currentOracleAddress: string;

  networkId?: number;
}

const initState: ConnectionState = {
  stakingAddresses: [],
  konoAddresses: [],
  oracleAddresses: [],
  oceanLendingAddresses: [],
  governorAddresses: [],

  currentStakingAddress: '',
  currentKonoAddress: '',
  currentOracleAddress: '',

  networkId: undefined
};

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_ABI_AND_ADDRESS, (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    })
    .addCase(actions.SET_CURRENT_ADDRESS, (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    })
    .addCase(actions.SET_NETWORK_ID, (state, { payload }) => {
      state.networkId = payload;
    })
    .addCase(actions.SET_CONTRACTS, (state, { payload }) => {
      return {
        ...state,
        ...payload
      };
    });
});
export const getCurrentNetworkId = (state: RootState) => state.connection.networkId;

export const getCurrentOracleSubscriptionAddress = (state: RootState) =>
  state.connection.currentOracleAddress;

export const getCurrentStakingAddress = (state: RootState) =>
  state.connection.currentStakingAddress;

export const getOracleSubscriptionContract = (state: RootState) =>
  state.connection.oracleSubscriptionContract;
export const getKonoContract = (state: RootState) => state.connection.konoContract;
export const getStakingContract = (state: RootState) => state.connection.stakingContract;
export const getOceanLendingContract = (state: RootState) => state.connection.oceanLendingContract;
export const getGovernorContract = (state: RootState) => state.connection.governorContract;

export const getStakingAbi = (state: RootState) => state.connection.stakingAbi;
export const getComptrollerAbi = (state: RootState) => state.connection.comptrollerAbi;
export const getOracleAbi = (state: RootState) => state.connection.oracleAbi;
export const getOTokenAbi = (state: RootState) => state.connection.oTokenAbi;
export const getKonoAbi = (state: RootState) => state.connection.konoAbi;
export const getOceanLendingAbi = (state: RootState) => state.connection.oceanLendingAbi;
export const getJumpInterestV2Abi = (state: RootState) => state.connection.jumpInterestV2Abi;
export const getGovernorAbi = (state: RootState) => state.connection.governorAbi;

export const getOceanLendingAddresses = (state: RootState) =>
  state.connection.oceanLendingAddresses;
export const getGovernorAddresses = (state: RootState) => state.connection.governorAddresses;
