import {
  IProposalClient,
  IProposalConnectionInfoItem,
  IProposalDataSource,
  IProposalIPFS
} from 'types/oracleProposal';

const createProposalConnectionInfo = (
  clientType: number,
  detail: any
): IProposalConnectionInfoItem => {
  return { clientType, detail };
};

const createProposalClient = (clientType: number, detail: any): IProposalClient => {
  return { clientType, connectionInfo: [createProposalConnectionInfo(clientType, detail)] };
};

const createIPFSProposal = (
  symbol: string,
  slug: string,
  leasePeriod: number,
  client: IProposalClient,
  networkId: number,
  aggregationStrategy: number,
  sources: Array<IProposalDataSource>
): IProposalIPFS => {
  return { symbol, slug, leasePeriod, client, networkId, aggregationStrategy, sources };
};

export { createProposalClient, createIPFSProposal };
