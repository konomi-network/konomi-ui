export interface INetwork {
  exploreUrl: string;
  blockTime: number;
  chainId: number;
  id: number;
  name: string;
}

export interface IAggregationStrategy {
  label: string;
  value: string;
}

export interface IStakingBatch {
  version: number;
  address: string;
  startDate: string;
}

export interface ILeasePeriodOption {
  id: number;
  name: string;
  seconds: number;
}
