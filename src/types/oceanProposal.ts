import { Proposal } from '@konomi-network/client';
export interface ICollateral {
  canBeCollateral: boolean;
  collateralFactor?: string | number;
}

export interface IInterest {
  baseRatePerYear?: string | number;
  multiplierPerYear?: string | number;
  jumpMultiplierPerYear?: string | number;
  kink?: string | number;
}
export interface ICurrency {
  symbol: string;
  underlying: string;
  subscriptionId: number;
  collateral: ICollateral;
  interest: IInterest;
}
export interface IOceanProposal extends Omit<Proposal, 'proposalDetail'> {
  closeFactor?: string | number;
  liquidationIncentive?: string | number;
  currencies: ICurrency[];
  proposalId: string;
  status: number;
}

export type IOceanLendingParams = IInterest &
  ICollateral & {
    closeFactor: string | number;
    liquidationIncentive: string | number;
  };
