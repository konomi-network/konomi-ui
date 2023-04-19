import { createAction } from '@reduxjs/toolkit';
import { IOceanCurrencyInfo } from 'types/ocean';

const SET_IS_FETCHING = createAction<boolean>('oceans/SET_IS_FETCHING');
const SET_OCEANS = createAction<any[]>('oceans/SET_OCEANS');
const SET_USER_OCEANS = createAction<any[]>('oceans/SET_USER_OCEANS');

const UPDATE_OCEAN = createAction<{ id: string; [key: string]: any }>('oceans/UPDATE_OCEAN');
const UPDATE_OCEAN_CURRENCY = createAction<{
  id: string;
  currency: IOceanCurrencyInfo;
  [key: string]: any;
}>('oceans/UPDATE_OCEAN_CURRENCY');

export default {
  SET_OCEANS,
  SET_USER_OCEANS,
  SET_IS_FETCHING,
  UPDATE_OCEAN,
  UPDATE_OCEAN_CURRENCY
};
