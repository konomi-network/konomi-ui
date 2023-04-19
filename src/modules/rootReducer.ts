import common from './common';
import connection from './connection';
import account from './account';
import oracles from './oracles';
import proposals from './proposals';
import transactions from './transactions';
import oceans from './oceans';

import { combineReducers } from '@reduxjs/toolkit';

const rootReducer = combineReducers({
  common: common.reducer,
  connection: connection.reducer,
  account: account.reducer,
  oracles: oracles.reducer,
  proposals: proposals.reducer,
  transactions: transactions.reducer,
  oceans: oceans.reducer
});
export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
