import { useSelector } from 'react-redux';
import FadeIn from 'react-fade-in';
import groupBy from 'lodash/groupBy';
import { SearchBar, Spinner, Antd } from 'components';
import { Empty, ProposalsRow } from './components';
import { getIsFetchingProposals, getMyOracleProposals } from 'modules/proposals';
import { useEffect, useState } from 'react';
import useGovernorContract from 'hooks/useGovernorContract';
import useProposalIPFS from 'hooks/useProposalIPFS';
import { IOracleProposal } from 'types/oracleProposal';

const { Row } = Antd;

type TProps = {};

const Proposals: React.FC<TProps> = () => {
  const { handleIPFSFetch } = useProposalIPFS();
  const { getProposals } = useGovernorContract();
  const isFetchingProposals = useSelector(getIsFetchingProposals);
  const proposals = useSelector(getMyOracleProposals);
  const [filteredProposals, setFilteredProposals] = useState<IOracleProposal[]>(proposals);
  const proposalsByStatus = groupBy(filteredProposals, 'status');

  useEffect(() => {
    filteredProposals.forEach((p) => {
      handleIPFSFetch(p);
    });
  }, [filteredProposals, handleIPFSFetch]);

  useEffect(() => {
    setFilteredProposals(proposals);
  }, [proposals]);

  useEffect(() => {
    getProposals();
  }, [getProposals]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchStr: string = e.target.value;
    if (!searchStr) {
      return setFilteredProposals(proposals);
    }
    const list = proposals.filter(({ ipfsData, proposalId }) => {
      const searchBy = ipfsData?.symbol || proposalId;
      return searchBy.toLowerCase().includes(searchStr?.toLowerCase());
    });
    return setFilteredProposals(list);
  };

  const renderProposals = () => {
    if (isFetchingProposals) {
      return <Spinner />;
    }

    if (!isFetchingProposals && !!proposals.length) {
      return (
        <div>
          <SearchBar
            className="mb-8"
            onSearch={onSearch}
            style={{ width: 340 }}
            placeholder="Type to search for a proposal"
          />
          <Row className="w-full flex-auto" gutter={[{}, { xs: 16, sm: 24, md: 32, lg: 48 }]}>
            {Object.keys(proposalsByStatus).map((key, index) => (
              <ProposalsRow key={index} status={+key} proposals={proposalsByStatus[+key]} />
            ))}
          </Row>
        </div>
      );
    }

    return <Empty />;
  };

  return <FadeIn>{renderProposals()}</FadeIn>;
};

export default Proposals;
