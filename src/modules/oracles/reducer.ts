import { createReducer, createSelector } from '@reduxjs/toolkit';
import unionBy from 'lodash/unionBy';
import keyBy from 'lodash/keyBy';
import values from 'lodash/values';
import set from 'lodash/set';
import unset from 'lodash/unset';
import { RootState } from 'modules/rootReducer';
import { IOracleSubscribed, IOracleWithSubscribeState } from 'types/oracle';
import { getCurrentNetworkId } from 'modules/connection/reducer';
import actions from './actions';

interface OraclesState {
  isFetching: boolean;
  error: any;
  tokens: IOracleWithSubscribeState[];
  mySubscriptions: IOracleSubscribed[];
  listToBeSubscribed: any[];
}

const initState: OraclesState = {
  isFetching: true,
  error: null,
  tokens: [],
  mySubscriptions: [],
  listToBeSubscribed: []
};

const notDeleted = (item: any) => item.operation !== 'DELETE';

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_ORACLES, (state, { payload }) => {
      const key = 'indexedSubscriptionId';
      const mergedTokens = unionBy(payload, state.tokens, key);
      const afterDeletedTokens = mergedTokens.filter(notDeleted);

      state.isFetching = false;
      state.tokens = afterDeletedTokens;
    })
    .addCase(actions.SET_MY_SUBSCRIPTIONS, (state, { payload }) => {
      if (!state.mySubscriptions.length) {
        state.mySubscriptions = payload;
        return;
      }

      const mergedSubscriptions = unionBy(payload, state.mySubscriptions, 'subscriptionId');
      const afterDeletedSubscriptions = mergedSubscriptions.filter(notDeleted);
      // resync the price feed
      afterDeletedSubscriptions.forEach((item) => {
        if (!item.value) {
          const syncData = state.mySubscriptions.find(
            (i) => i.subscriptionId === item.subscriptionId
          );
          item.value = syncData?.value;
          item.decimals = syncData?.decimals;
        }
      });
      state.mySubscriptions = afterDeletedSubscriptions;
    })
    .addCase(actions.UPDATE_MY_SUBSCRIPTIONS, (state, { payload }) => {
      if (!state.mySubscriptions.length) {
        state.mySubscriptions = payload;
        return;
      }

      const newData = keyBy(payload, 'subscriptionId');
      const mySubscriptions = state.mySubscriptions.map((item) => {
        const subscriptionId = item.subscriptionId;
        const updateItem = newData[subscriptionId];
        if (updateItem) {
          return {
            ...item,
            ...updateItem
          };
        }
        return item;
      });
      state.mySubscriptions = mySubscriptions;
    })
    .addCase(actions.ADD_TO_BE_SUBSCRIBED, (state, { payload }) => {
      const newTokenMap = keyBy(state.tokens, 'indexedSubscriptionId');
      set(newTokenMap, `${payload}.toSubscribe`, true);
      state.tokens = values(newTokenMap);
    })
    .addCase(actions.REMOVE_TO_BE_SUBSCRIBED, (state, { payload }) => {
      const newTokenMap = keyBy(state.tokens, 'indexedSubscriptionId');
      unset(newTokenMap, `${payload}.toSubscribe`);
      state.tokens = values(newTokenMap);
    })
    .addCase(actions.UPDATE_SUBSCRIBE_LEASE_PERIOD, (state, { payload }) => {
      const newTokenMap = keyBy(state.tokens, 'indexedSubscriptionId');
      set(newTokenMap, `${payload.key}.leasePeriod`, `${payload.value}`);
      state.tokens = values(newTokenMap);
    })
    .addCase(actions.UPDATE_SUBSCRIBE_CLIENT_TYPE, (state, { payload }) => {
      const newTokenMap = keyBy(state.tokens, 'indexedSubscriptionId');
      set(newTokenMap, `${payload.key}.clientType`, `${payload.value}`);
      state.tokens = values(newTokenMap);
    })
    .addCase(actions.UPDATE_SUBSTRATE_CLIENT_INFO, (state, { payload }) => {
      const newTokenMap = keyBy(state.tokens, 'indexedSubscriptionId');
      set(newTokenMap, `${payload.key}.${payload.field}`, `${payload.value}`);
      state.tokens = values(newTokenMap);
    });
});

export const getIsFetchingOracles = (state: RootState) => state.oracles.isFetching;
export const getOracles = (state: RootState) => state.oracles.tokens;
export const getMySubscriptions = (state: RootState) => state.oracles.mySubscriptions;
export const getOraclesByNetwork = createSelector(
  getCurrentNetworkId,
  getOracles,
  (networkId, oracles) => {
    if (networkId === undefined || !oracles.length) return [];
    return oracles.filter((i) => i.networkId === networkId);
  }
);

export const getToSubscribeOracles = createSelector(
  getCurrentNetworkId,
  getOracles,
  (networkId, oracles) => {
    if (networkId === undefined || !oracles.length) return [];
    return oracles.filter((i) => i.networkId === networkId && i.toSubscribe);
  }
);
