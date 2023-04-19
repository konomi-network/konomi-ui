import { createReducer } from '@reduxjs/toolkit';
import { RootState } from 'modules/rootReducer';
import actions from './actions';

interface TransactionsState {
  pending: string[];
  success: string[];
  failed: string[];
}

const initState: TransactionsState = {
  pending: [],
  success: [],
  failed: []
};

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_PENDING, (state, { payload }) => {
      state.pending = state.pending.concat(payload);
    })
    .addCase(actions.SET_SUCCESS, (state, { payload }) => {
      state.pending = state.pending.filter((t) => t !== payload);
      state.success = state.success.concat(payload);
    })
    .addCase(actions.SET_FAILED, (state, { payload }) => {
      state.pending = state.pending.filter((t) => t !== payload);
      state.failed = state.failed.concat(payload);
    })
    .addCase(actions.REMOVE_SUCCESS, (state, { payload }) => {
      if (typeof payload === 'string') state.success = state.success.filter((t) => t !== payload);
      else state.success = [];
    })
    .addCase(actions.REMOVE_FAILED, (state, { payload }) => {
      if (typeof payload === 'string') state.failed = state.failed.filter((t) => t !== payload);
      else state.failed = [];
    });
});

export const getTransactions = (state: RootState) => state.transactions;
