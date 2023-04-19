export interface IOracle {
  slug: string;
  symbol: string;
  createdTimestamp: string;
  updatedTimestamp: string;
  operation: string;
  reportingStrategy: number;
  aggregationStrategy: number;
  decimals: number;
  value: number;
  subscriptionId: number;
  indexedSubscriptionId: number;
  networkId: number;
  status: number;
  sources: number[];
}

export interface IOracleWithSubscribeState extends IOracle {
  leasePeriod?: string;
  clientType?: string;
  parachainName?: string;
  parachainUrl?: string;
  feedId?: string;
  toSubscribe?: boolean;
}
export interface IOracleSubscribed extends IOracle {
  id: number;
  transactionHash: string;
  contractAddress: string;
  user: string;
  display: boolean;
  leaseEnd: number;
  clientInfoId: number;
  client: {
    clientType: number;
    connectionInfo: {
      contractAddress: number;
      networkId: number;
    };
  };
}
