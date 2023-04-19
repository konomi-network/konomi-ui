import { createAction } from '@reduxjs/toolkit';

const SET_ORACLES = createAction<any[]>('oracles/SET_ORACLES');
const SET_MY_SUBSCRIPTIONS = createAction<any[]>('oracles/SET_MY_SUBSCRIPTIONS');
const UPDATE_MY_SUBSCRIPTIONS = createAction<any[]>('oracles/UPDATE_MY_SUBSCRIPTIONS');
const ADD_TO_BE_SUBSCRIBED = createAction<number>('oracles/ADD_TO_BE_SUBSCRIBED');
const REMOVE_TO_BE_SUBSCRIBED = createAction<number>('oracles/REMOVE_TO_BE_SUBSCRIBED');
const UPDATE_SUBSCRIBE_LEASE_PERIOD = createAction<{ key: number; value: string }>(
  'oracles/UPDATE_SUBSCRIBE_LEASE_PERIOD'
);
const UPDATE_SUBSCRIBE_CLIENT_TYPE = createAction<{ key: number; value: string }>(
  'oracles/UPDATE_SUBSCRIBE_CLIENT_TYPE'
);
const UPDATE_SUBSTRATE_CLIENT_INFO = createAction<{ key: number; value: string; field: string }>(
  'oracles/UPDATE_SUBSTRATE_CLIENT_INFO'
);
export default {
  SET_ORACLES,
  SET_MY_SUBSCRIPTIONS,
  UPDATE_MY_SUBSCRIPTIONS,
  ADD_TO_BE_SUBSCRIBED,
  REMOVE_TO_BE_SUBSCRIBED,
  UPDATE_SUBSCRIBE_LEASE_PERIOD,
  UPDATE_SUBSCRIBE_CLIENT_TYPE,
  UPDATE_SUBSTRATE_CLIENT_INFO
};
