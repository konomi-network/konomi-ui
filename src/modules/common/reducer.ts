import { getCurrentNetworkId } from 'modules/connection/reducer';
import keyBy from 'lodash/keyBy';
import { createReducer, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'modules/rootReducer';
import actions from './actions';
import { IAggregationStrategy, INetwork, IStakingBatch, ILeasePeriodOption } from 'types/common';
import { IOceanLendingParams } from 'types/oceanProposal';

interface CommonState {
  config: {
    defaultParams: {
      oceanLending: IOceanLendingParams;
    };
    blockConfirmations: number;
    slugSize: number;
    symbolSize: number;
    ipfsTimeout: number;
    disabledFeatures: Record<string, number[]>;
    supportedNetworks: INetwork[];
    supportedNetworkMap: { [key: number]: INetwork };
    staking: { [key: number]: any };
    leasePeriod: { [key: string]: ILeasePeriodOption[] };
    oceanLending: { oceanTotalSupplyCap: number };
  };
  reportingStrategy: { [key: number]: string };
  clients: any[];
  clientMap: { [key: number]: string };
  aggregationStrategies: IAggregationStrategy[];
  aggregationStrategy: { [key: number]: string };
  dataSources: any[];
  dataSource: { [key: number]: string };
  imageMap: { [key: string]: { image: string; name: string } };
  leasePeriodOptions: any[];
  networkError: boolean;
  showWalletConnector: boolean;
  stakingType: string;
}

const initState: CommonState = {
  config: {
    defaultParams: {
      oceanLending: {
        canBeCollateral: false,
        baseRatePerYear: 20,
        closeFactor: 50,
        collateralFactor: 50,
        jumpMultiplierPerYear: 40,
        kink: 80,
        liquidationIncentive: 1.08,
        multiplierPerYear: 18
      }
    },
    blockConfirmations: 3,
    slugSize: 32,
    symbolSize: 8,
    ipfsTimeout: 60,
    disabledFeatures: {
      oceanLend: [4],
      oracle: [4]
    },
    supportedNetworks: [],
    supportedNetworkMap: {},
    staking: {},
    leasePeriod: {},
    oceanLending: {
      oceanTotalSupplyCap: 0
    }
  },
  reportingStrategy: {},
  clientMap: {},
  clients: [],
  aggregationStrategy: {},
  aggregationStrategies: [],
  dataSources: [],
  dataSource: {},
  imageMap: {},
  showWalletConnector: false,
  leasePeriodOptions: [],
  networkError: false,
  stakingType: '' // default not select any type
};

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_SCHEMAS, (state, { payload }) => {
      const { networkId, clientType, leasePeriod, ...rest } = payload;
      return {
        ...state,
        ...rest,
        leasePeriodOptions: leasePeriod.map((i: any) => ({
          id: i.id,
          label: i.name,
          value: i.blockNumber
        })),
        clientMap: clientType,
        clients: Object.keys(clientType).map((key) => {
          return {
            label: clientType[key],
            value: key
          };
        }),
        dataSources: Object.keys(payload.dataSource).map((key) => {
          return {
            label: payload.dataSource[key],
            value: key
          };
        }),
        aggregationStrategies: Object.keys(payload.aggregationStrategy).map((key) => {
          return {
            label: payload.aggregationStrategy[key],
            value: key
          };
        })
      };
    })
    .addCase(actions.SET_CONFIG, (state, { payload }) => {
      state.config = {
        ...payload,
        supportedNetworkMap: keyBy(payload.supportedNetworks, 'id')
      };
    })
    .addCase(actions.SET_IMAGES, (state, { payload }) => {
      state.imageMap = {
        ...state.imageMap,
        ...keyBy(payload, 'name')
      };
    })
    .addCase(actions.SET_NETWORK_ERROR, (state, { payload }) => {
      state.networkError = payload;
    })
    .addCase(actions.TOGGLE_WALLET_CONNECTOR, (state, { payload }) => {
      state.showWalletConnector = payload === undefined ? !state.showWalletConnector : payload;
    })
    .addCase(actions.SET_STAKING_TYPE, (state, { payload }) => {
      state.stakingType = payload;
    });
});

export const getShowWalletConnector = (state: RootState) => state.common.showWalletConnector;
export const getNetworkError = (state: RootState) => state.common.networkError;
export const getSupportedNetworks = (state: RootState) => state.common.config.supportedNetworks;
export const getSupportedNetworkMap = (state: RootState) => state.common.config.supportedNetworkMap;
export const getConfig = (state: RootState) => state.common.config;
export const getBlocksConfirmation = (state: RootState) => state.common.config?.blockConfirmations;
export const getClients = (state: RootState) => state.common.clients;
export const getClientMap = (state: RootState) => state.common.clientMap;
export const getImageMap = (state: RootState) => state.common.imageMap;
export const getDataSourceMap = (state: RootState) => state.common.dataSource;
export const getDataSources = (state: RootState) => state.common.dataSources;
export const getAggregationStrategyMap = (state: RootState) => state.common.aggregationStrategy;
export const getAggregationStrategies = (state: RootState) => state.common.aggregationStrategies;
export const getLeasePeriodOptions = (state: RootState) => state.common.leasePeriodOptions;
export const getReportingStrategyMap = (state: RootState) => state.common.reportingStrategy;
export const getDisabledFeatures = (state: RootState) => state.common.config.disabledFeatures;
export const getStakingMap = (state: RootState) => state.common.config.staking;
export const getCurrentStakingType = (state: RootState) => state.common.stakingType;
export const getOceanLeasePeriodOptions = (state: RootState) =>
  state.common.config.leasePeriod?.oceanLending || [];
export const getOceanLendingDefaultParams = (state: RootState) =>
  state.common.config.defaultParams?.oceanLending || {};
export const getOceanMaxSupply = (state: RootState) =>
  state.common.config.oceanLending.oceanTotalSupplyCap;

export const getBlockTime = (state: RootState) => {
  const networkId = state.connection.networkId;
  if (networkId === undefined) return 0;
  return state.common.config.supportedNetworkMap[networkId].blockTime;
};

export const getSupportedChainIds = createSelector(getSupportedNetworks, (supportedNetworks) => {
  return supportedNetworks.map((i: INetwork) => i.chainId);
});

export const getStakingTypes = createSelector(
  getCurrentNetworkId,
  getStakingMap,
  (networkId, staking) => {
    if (networkId === undefined) return [];
    if (Object.keys(staking).includes(networkId.toString())) {
      return Object.keys(staking[networkId]) as string[];
    }
    return [];
  }
);

export const getStakingPhases = (state: RootState) => {
  const networkId = state.connection.networkId;
  const stakingType = state.common.stakingType;
  if (networkId === undefined || !stakingType || !state.common.config.staking[networkId]) return [];
  return (state.common.config.staking[networkId][stakingType] as IStakingBatch[]) || [];
};
