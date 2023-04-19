import { createAction } from '@reduxjs/toolkit';

const SET_ABI_AND_ADDRESS = createAction<any>('connection/SET_ABI_AND_ADDRESS');
const SET_CURRENT_ADDRESS = createAction<any>('connection/SET_CURRENT_ADDRESS');
const SET_NETWORK_ID = createAction<number>('connection/SET_NETWORK_ID');
const SET_CONTRACTS = createAction<any>('connection/SET_CONTRACTS');

export default {
  SET_ABI_AND_ADDRESS,
  SET_CURRENT_ADDRESS,
  SET_NETWORK_ID,
  SET_CONTRACTS
};
