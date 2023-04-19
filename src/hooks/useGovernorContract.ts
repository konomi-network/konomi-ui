import { useNavigate } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { TransactionReceipt } from 'web3-core';
import { ProposalType, ProposalFactory, TxnCallbacks } from '@konomi-network/client';
import { PoolConfig, TokenConfig } from '@konomi-network/client/dist/config';
import { convertBNtoTokens } from 'utils/web3';
import transactionsActions from 'modules/transactions/actions';
import proposalsActions from 'modules/proposals/actions';

import {
  getProposalConfig,
  getIsFetchedProposals,
  getIsFetchingProposals
} from 'modules/proposals';
import { getBlocksConfirmation } from 'modules/common/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { getGovernorContract } from 'modules/connection/reducer';
import { getOraclesByNetwork } from 'modules/oracles/reducer';

import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useIsMounted from './useIsMounted';
import { ICurrency } from 'types/oceanProposal';

const useGovernorContract = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMounted = useIsMounted();
  const { library } = useActiveWeb3React();
  const oracles = useSelector(getOraclesByNetwork);
  const isFetchingProposals = useSelector(getIsFetchingProposals);
  const isFetchedProposals = useSelector(getIsFetchedProposals);
  const governorContract = useSelector(getGovernorContract);
  const selectedAccount = useSelector(getSelectedAccount);
  const confirmations = useSelector(getBlocksConfirmation);
  const { voteType } = useSelector(getProposalConfig);
  const [isVoted, setIsVoted] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [payable, setPayable] = useState(0);

  const hasVoted = useCallback(
    async (proposalId: string) => {
      if (selectedAccount && governorContract) {
        return governorContract
          .hasVoted(proposalId, selectedAccount?.address)
          .then((value: any) => {
            if (isMounted()) {
              setIsVoted(value);
              setIsVoting(false);
            }
          });
      }
    },
    [isMounted, governorContract, selectedAccount]
  );

  const getProposalDetail = useCallback(
    async (id: string) => {
      if (governorContract) {
        try {
          const proposal = await governorContract.getProposal(id);
          console.log('🚀 ~ proposal', proposal);
          dispatch(proposalsActions.UPDATE_PROPOSAL({ id, data: proposal }));
        } catch (error) {
          console.log('🚀 getProposals ~ error', error);
        }
      }
    },
    [dispatch, governorContract]
  );

  const getProposals = useCallback(
    async (isForcing: boolean = false) => {
      if (governorContract && ((!isFetchingProposals && !isFetchedProposals) || isForcing)) {
        try {
          dispatch(proposalsActions.SET_IS_FETCHING(true));
          const ids = await governorContract.getActiveProposals();
          const statusList = await Promise.all(ids.map((id) => governorContract.getState(id)));
          const proposals = await Promise.all(ids.map((id) => governorContract.getProposal(id)));
          const proposalsWithStatus = proposals.map((p, index) => ({
            ...p,
            proposalId: ids[index],
            status: statusList[index]
          }));

          const oracleProposals = proposalsWithStatus.filter(
            (p) => p.proposalType === ProposalType.NewOracle
          );

          const oceanProposals = proposalsWithStatus
            .filter((p) => p.proposalType === ProposalType.NewOcean)
            .map(({ proposalDetail, ...rest }) => ({
              ...rest,
              closeFactor: (proposalDetail.pool?.closeFactor?.toNumber() || 5000) / 100,
              liquidationIncentive:
                (proposalDetail.pool?.liquidationIncentive?.toNumber() || 1080) / 1000,
              currencies: proposalDetail.pool?.tokens?.map(
                (t: TokenConfig): ICurrency => ({
                  underlying: t.underlying.toString(),
                  subscriptionId: t.subscriptionId.toNumber(),
                  symbol:
                    oracles.find((o) => o.subscriptionId === t.subscriptionId.toNumber())?.symbol ||
                    '',
                  interest: {
                    baseRatePerYear: (t.interest.values()[0]?.toNumber() || 0) / 100,
                    multiplierPerYear: (t.interest.values()[1]?.toNumber() || 0) / 100,
                    jumpMultiplierPerYear: (t.interest.values()[2]?.toNumber() || 0) / 100,
                    kink: (t.interest.values()[3]?.toNumber() || 0) / 100
                  },
                  collateral: {
                    canBeCollateral: t.collateral.canBeCollateral,
                    collateralFactor: (t.collateral.collateralFactor?.toNumber() || 0) / 100
                  }
                })
              )
            }));
          dispatch(
            proposalsActions.SET_PROPOSALS({
              oceans: oceanProposals,
              oracles: oracleProposals
            })
          );
        } catch (error) {
          console.log('🚀 getProposals ~ error', error);
        }
      }
    },
    [dispatch, governorContract, isFetchedProposals, isFetchingProposals, oracles]
  );

  const getPayable = useCallback(async () => {
    if (governorContract) {
      const result = await governorContract.getPayable();
      if (isMounted()) setPayable(convertBNtoTokens(result));
    }
  }, [governorContract, isMounted]);

  const proposeOracle = useCallback(
    async (
      {
        sources,
        leasePeriod,
        clientType,
        cid
      }: {
        sources: string[];
        leasePeriod: string;
        clientType: string;
        cid: string;
      },
      pendingCallback: Function = () => {}
    ) => {
      if (selectedAccount && governorContract && library) {
        setIsCreating(true);
        try {
          const newOracleDetails = {
            externalStorageHash: cid,
            leasePeriod: leasePeriod,
            clientType: clientType,
            sourceCount: sources.length.toString(),
            onBehalfOf: selectedAccount.address
          };

          const factory = new ProposalFactory(library);
          const proposalDetail = factory.makeProposal(ProposalType.NewOracle, newOracleDetails);

          const callbacks: TxnCallbacks = [
            (transactionHash: string) => {
              dispatch(transactionsActions.SET_PENDING(transactionHash));
              pendingCallback();
            },
            (receipt: TransactionReceipt) => {
              if (receipt) {
                if (isMounted()) {
                  setIsCreating(false);
                }
                if (receipt.status) {
                  getProposals(true);
                  dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
                } else {
                  dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
                }
              }
            },
            (error: Error, receipt: TransactionReceipt) => {
              if (isMounted()) {
                setIsCreating(false);
              }
              if (receipt && !receipt.status) {
                dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
              }
            }
          ];

          governorContract.propose(proposalDetail, 'oracle', { confirmations }, ...callbacks);
        } catch (err) {
          console.log(err, 'err');
        }
      }
    },
    [selectedAccount, governorContract, library, confirmations, dispatch, isMounted, getProposals]
  );

  const proposeOcean = useCallback(
    (
      {
        pool,
        leasePeriod
      }: {
        pool: PoolConfig;
        leasePeriod: number;
      },
      onEnd: (err?: any) => void
    ) => {
      if (governorContract && selectedAccount && library) {
        setIsCreating(true);
        const factory = new ProposalFactory(library);
        const proposalDetail = factory.makeProposal(ProposalType.NewOcean, {
          pool,
          poolOwner: selectedAccount.address,
          leasePeriod
        });
        const callbacks: TxnCallbacks = [
          (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          },
          (receipt: TransactionReceipt) => {
            onEnd();
            if (isMounted()) {
              setIsCreating(false);
            }
            if (receipt.status) {
              getProposals(true);
              dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
              navigate('/governance?tab=oceans');
            } else {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          },
          (error: Error, receipt: TransactionReceipt) => {
            if (isMounted()) {
              setIsCreating(false);
            }
            if (receipt && !receipt.status) {
              onEnd();
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          }
        ];
        governorContract.propose(proposalDetail, 'oceanLending', { confirmations }, ...callbacks);
      }
    },
    [
      governorContract,
      selectedAccount,
      library,
      confirmations,
      dispatch,
      isMounted,
      getProposals,
      navigate
    ]
  );

  const execute = useCallback(
    (proposalId: string, endCallback?: (error?: any) => void) => {
      if (selectedAccount && governorContract) {
        setIsExecuting(true);
        const callbacks: TxnCallbacks = [
          (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          },
          (receipt: TransactionReceipt) => {
            if (receipt) {
              if (isMounted()) {
                setIsExecuting(false);
                getProposalDetail(proposalId);
              }
              if (receipt.status) {
                dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
              } else {
                dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
              }
            }
          },
          (error: Error, receipt: TransactionReceipt) => {
            if (isMounted()) {
              setIsExecuting(false);
            }
            if (receipt && !receipt.status) {
              if (endCallback) endCallback(error);
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          }
        ];

        governorContract
          .execute(proposalId, { confirmations }, ...callbacks)
          .catch((error: any) => {
            if (isMounted()) {
              setIsExecuting(false);
            }
            if (endCallback) endCallback(error);
          });
      }
    },
    [selectedAccount, governorContract, confirmations, dispatch, isMounted, getProposalDetail]
  );

  const voteProposal = useCallback(
    ({
      proposalId,
      isApprove,
      reason
    }: {
      proposalId: string;
      isApprove: boolean;
      reason?: string;
    }) => {
      if (selectedAccount && governorContract) {
        setIsVoting(true);
        const callbacks: TxnCallbacks = [
          (transactionHash: string) => {
            dispatch(transactionsActions.SET_PENDING(transactionHash));
          },
          (receipt: TransactionReceipt) => {
            console.log(receipt, 'receipt');
            if (receipt) {
              if (isMounted()) {
                setIsVoting(false);
              }
              if (receipt.status) {
                getProposalDetail(proposalId);
                hasVoted(proposalId);
                dispatch(transactionsActions.SET_SUCCESS(receipt.transactionHash));
              } else {
                dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
              }
            }
          },
          (error: Error, receipt?: TransactionReceipt) => {
            if (isMounted()) {
              setIsVoting(false);
            }
            if (receipt && !receipt.status) {
              dispatch(transactionsActions.SET_FAILED(receipt.transactionHash));
            }
          }
        ];

        const method = reason
          ? governorContract.castVoteWithReason(
              proposalId,
              isApprove ? voteType.For! : voteType.Against!,
              reason,
              {
                confirmations
              },
              ...callbacks
            )
          : governorContract.castVote(
              proposalId,
              isApprove ? voteType.For! : voteType.Against!,
              { confirmations },
              ...callbacks
            );

        method.catch((err) => {
          console.log('vote error', err);

          if (isMounted()) {
            setIsVoting(false);
          }
        });
      }
    },
    [
      selectedAccount,
      governorContract,
      voteType.For,
      voteType.Against,
      confirmations,
      dispatch,
      isMounted,
      getProposalDetail,
      hasVoted
    ]
  );

  return {
    isCreating,
    isExecuting,
    isVoting,
    isVoted,
    payable,
    governorContract,
    execute,
    getProposalDetail,
    getPayable,
    getProposals,
    hasVoted,
    voteProposal,
    proposeOracle,
    proposeOcean
    // isAdmin
  };
};

export default useGovernorContract;
