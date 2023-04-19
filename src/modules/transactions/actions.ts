import { createAction } from '@reduxjs/toolkit';

const SET_PENDING = createAction<string>('transactions/SET_PENDING');
const SET_SUCCESS = createAction<string>('transactions/SET_SUCCESS');
const SET_FAILED = createAction<string>('transactions/SET_FAILED');
const REMOVE_SUCCESS = createAction<string | string[]>('transactions/REMOVE_SUCCESS');
const REMOVE_FAILED = createAction<string | string[]>('transactions/REMOVE_FAILED');

export default { SET_PENDING, SET_SUCCESS, REMOVE_SUCCESS, SET_FAILED, REMOVE_FAILED };
