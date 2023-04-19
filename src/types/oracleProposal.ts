import { Proposal } from '@konomi-network/client';

// The proposal schemas conforms to oracle-backend/blob/develop/src/main/resources/proposalSchema.json
export interface IProposalDataSource {
  type: number;
  detail: {
    coinId?: string;
    address?: string;
  };
}
export interface IProposalConnectionInfoItem {
  clientType: number;
  detail: Partial<{
    connectionUrl?: string;
    feedId?: string;
    parachainName?: string;
  }>;
}
export interface IProposalClient {
  clientType: number;
  connectionInfo: IProposalConnectionInfoItem[];
}

export interface IProposalCreate {
  cid?: string;
  sources?: string[];
  symbol?: string;
  slug?: string;
  networkId?: number;
  leasePeriod?: number;
  aggregationStrategy?: number;
  client?: IProposalClient;
  clientType?: number;
}

// from IPFS
export interface IProposalIPFS {
  sources: IProposalDataSource[];
  symbol: string;
  slug: string;
  networkId: number;
  leasePeriod: number;
  aggregationStrategy: number;
  client: IProposalClient;
}
export interface IOracleProposal extends Proposal {
  status: number;
  proposalId: string;
  ipfsData?: IProposalIPFS;
  ipfsError?: boolean;
}

export interface IProposalWithOrder extends IOracleProposal {
  order: number;
}

export interface IProposalSelectedDataSource {
  [key: string]: boolean;
}

export type TDataSource = {
  label: string;
  value: string;
};
