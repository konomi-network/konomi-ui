import { createAction } from '@reduxjs/toolkit';

const SET_SCHEMAS = createAction<any>('common/SET_SCHEMAS');
const SET_CONFIG = createAction<any>('common/SET_CONFIG');
const SET_IMAGES = createAction<any>('common/SET_IMAGES');
const SET_STAKING_TYPE = createAction<string>('common/SET_STAKING_TYPE');
const SET_NETWORK_ERROR = createAction<boolean>('common/SET_NETWORK_ERROR');
const TOGGLE_WALLET_CONNECTOR = createAction<boolean>('common/TOGGLE_WALLET_CONNECTOR');

export default {
  SET_CONFIG,
  SET_SCHEMAS,
  SET_IMAGES,
  SET_STAKING_TYPE,
  SET_NETWORK_ERROR,
  TOGGLE_WALLET_CONNECTOR
};
