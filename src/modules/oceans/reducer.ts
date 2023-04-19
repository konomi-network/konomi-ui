import { getCurrentNetworkId } from 'modules/connection/reducer';
import { createReducer, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'modules/rootReducer';
import { IOcean } from 'types/ocean';
import actions from './actions';
import { areEqualAddresses } from 'utils/web3';
import { getSelectedAccount } from 'modules/account/reducer';

interface OceansState {
  isFetching: boolean;
  isFetched: boolean;
  error: any;
  data: IOcean[];
}

const initState: OceansState = {
  isFetching: false,
  isFetched: false,
  error: null,
  data: []
};

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_IS_FETCHING, (state, { payload }) => {
      state.isFetching = payload;
      state.isFetched = false;
    })
    .addCase(actions.SET_OCEANS, (state, { payload }) => {
      state.data = payload;
      state.isFetching = false;
      state.isFetched = true;
    })
    .addCase(actions.UPDATE_OCEAN, (state, { payload }) => {
      const { id, ...rest } = payload;
      const index = state.data.findIndex((o) => o.id === id);
      if (index >= 0) {
        state.data[index] = {
          ...state.data[index],
          ...rest,
          isLoading: false
        };
      }
    })
    .addCase(actions.UPDATE_OCEAN_CURRENCY, (state, { payload }) => {
      const { id, currency, ...rest } = payload;
      const index = state.data.findIndex((o) => o.id === id);
      if (index >= 0) {
        const currencyIndex = state.data[index].currencies.findIndex(
          (p) => p.underlyingSymbol === currency.underlyingSymbol
        );

        state.data[index] = {
          ...state.data[index],
          ...rest
        };
        state.data[index].currencies[currencyIndex] = currency;
      }
    });
});
export const getIsFetchingOceans = (state: RootState) => state.oceans.isFetching;
export const getIsFetchedOceans = (state: RootState) => state.oceans.isFetched;
export const getOceans = (state: RootState) => state.oceans.data;

export const getOceansByNetwork = createSelector(
  getCurrentNetworkId,
  getOceans,
  (networkId, oceans) => {
    if (networkId === undefined || !oceans.length) return [];
    return oceans;
  }
);

export const getUserOceansByNetwork = createSelector(
  getCurrentNetworkId,
  getOceans,
  getSelectedAccount,
  (networkId, oceans, selectedAccount) => {
    if (!selectedAccount || networkId === undefined || !oceans.length) return [];
    return oceans.filter((i) => areEqualAddresses(i.ownerAddress, selectedAccount.address));
  }
);
