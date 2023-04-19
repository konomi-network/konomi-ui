import { IProposalSelectedDataSource } from 'types/oracleProposal';
import intersection from 'lodash/intersection';

const useOracleNewProposal = () => {
  const sourcesIdWithCoinId = ['1'];
  const sourcesIdWithAddress = ['3', '4'];

  const sourcesRequireCoinId = (source: IProposalSelectedDataSource) => {
    const sourceKeyArr = Object.keys(source);
    return intersection(sourcesIdWithCoinId, sourceKeyArr).length > 0;
  };

  const sourcesRequireAddress = (source: IProposalSelectedDataSource) => {
    const sourceKeyArr = Object.keys(source);
    return intersection(sourcesIdWithAddress, sourceKeyArr).length > 0;
  };

  return {
    sourcesRequireCoinId,
    sourcesRequireAddress,
    sourcesIdWithCoinId,
    sourcesIdWithAddress
  };
};

export default useOracleNewProposal;
