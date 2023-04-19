import { ProposalType } from '@konomi-network/client/dist/proposal/type';
import { createReducer, createSelector } from '@reduxjs/toolkit';
import { getSelectedAccount } from 'modules/account/reducer';
import { getCurrentNetworkId } from 'modules/connection/reducer';
import { RootState } from 'modules/rootReducer';
import { IOceanProposal } from 'types/oceanProposal';
import { IOracleProposal } from 'types/oracleProposal';
import { areEqualAddresses } from 'utils/web3';
import actions from './actions';

interface ProposalsState {
  isFetching: boolean;
  isFetched: boolean;
  error: any;
  oracles: IOracleProposal[];
  oceans: IOceanProposal[];
  config: {
    status: { [key: number]: string };
    voteType: {
      For?: number;
      Against?: number;
    };
  };
}

const initState: ProposalsState = {
  isFetching: false,
  isFetched: false,
  error: null,
  oracles: [],
  oceans: [],
  config: {
    status: {},
    voteType: {}
  }
};

export default createReducer(initState, (builder) => {
  builder
    .addCase(actions.SET_CONFIG, (state, action) => {
      state.config = action.payload;
    })
    .addCase(actions.SET_IS_FETCHING, (state, { payload }) => {
      state.isFetching = payload;
      state.isFetched = false;
      state.oceans = [];
      state.oracles = [];
    })
    .addCase(actions.SET_PROPOSALS, (state, { payload }) => {
      state.isFetching = false;
      state.isFetched = true;
      state.oracles = payload.oracles;
      state.oceans = payload.oceans;
    })
    .addCase(actions.SET_DATA_FROM_IPFS, (state, { payload }) => {
      state.oracles = state.oracles.map((i) =>
        i.proposalId === payload.id ? { ...i, ipfsData: payload.data, ipfsError: false } : i
      );
    })
    .addCase(actions.UPDATE_PROPOSAL, (state, { payload }) => {
      const { data, id } = payload;
      switch (data.proposalType) {
        case ProposalType.NewOcean: {
          const index = state.oceans.findIndex((p) => p.proposalId === id);
          if (index > -1) {
            state.oceans[index] = {
              ...state.oceans[index],
              ...data
            };
          }
          break;
        }
        case ProposalType.NewOracle: {
          const index = state.oracles.findIndex((p) => p.proposalId === id);
          if (index > -1) {
            state.oracles[index] = {
              ...state.oracles[index],
              ...data
            };
          }
          break;
        }
        default:
          break;
      }
    });
});

export const getIsFetchingProposals = (state: RootState) => state.proposals.isFetching;
export const getIsFetchedProposals = (state: RootState) => state.proposals.isFetched;
export const getProposalConfig = (state: RootState) => state.proposals.config;
export const getProposalVoteTypes = (state: RootState) => state.proposals.config.voteType;
export const getOceanProposals = (state: RootState) => state.proposals.oceans;
export const getOracleProposals = (state: RootState) => state.proposals.oracles;

export const getOceanProposalsByNetwork = createSelector(
  getCurrentNetworkId,
  getOceanProposals,
  (networkId, proposals) => {
    if (networkId === undefined || !proposals.length) return [];
    return proposals;
  }
);

export const getOracleProposalByNetwork = createSelector(
  getCurrentNetworkId,
  getOracleProposals,
  (networkId, proposals) => {
    if (networkId === undefined || !proposals.length) return [];
    return proposals;
  }
);

export const getMyOracleProposals = createSelector(
  getSelectedAccount,
  getOracleProposalByNetwork,
  (selectedAccount, proposals) => {
    const myAddress = selectedAccount?.address;
    if (myAddress) {
      return proposals.filter((p) => areEqualAddresses(p.proposer, myAddress));
    }
    return [];
  }
);

export const getMyOceanProposals = createSelector(
  getSelectedAccount,
  getOceanProposalsByNetwork,
  (selectedAccount, proposals) => {
    const myAddress = selectedAccount?.address;
    if (myAddress) {
      return proposals.filter((p) => areEqualAddresses(p.proposer, myAddress));
    }
    return [];
  }
);
