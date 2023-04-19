import { createAction } from '@reduxjs/toolkit';
import { IOceanProposal } from 'types/oceanProposal';
import { IOracleProposal } from 'types/oracleProposal';

const SET_CONFIG = createAction<any>('proposals/SET_CONFIG');
const SET_PROPOSALS = createAction<{
  oceans: IOceanProposal[];
  oracles: IOracleProposal[];
}>('proposals/SET_PROPOSALS');
const SET_IS_FETCHING = createAction<boolean>('proposals/SET_IS_FETCHING');
const SET_DATA_FROM_IPFS = createAction<any>('proposals/SET_DATA_FROM_IPFS');
const UPDATE_PROPOSAL = createAction<{ id: string; data: any }>('proposals/UPDATE_PROPOSAL');

export default {
  SET_PROPOSALS,
  SET_IS_FETCHING,
  SET_DATA_FROM_IPFS,
  SET_CONFIG,
  UPDATE_PROPOSAL
};
