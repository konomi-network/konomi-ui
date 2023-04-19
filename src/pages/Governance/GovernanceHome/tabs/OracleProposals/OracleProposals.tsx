import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import FadeIn from 'react-fade-in';
import cx from 'classnames';
import groupBy from 'lodash/groupBy';
import { TokenCard, SearchBar, Spinner, Antd } from 'components';
import { getIsFetchingProposals, getOracleProposalByNetwork } from 'modules/proposals';
import { IOracleProposal } from 'types/oracleProposal';
import { PROPOSAL_STATUS_MAP } from 'utils/status';
import useProposalIPFS from 'hooks/useProposalIPFS';

import { StatusSelect, Empty, ToNewProposal } from './components';
import styles from './OracleProposals.module.scss';

const { Row, Col, Pagination } = Antd;

const PAGE_SIZE = 20;

const OracleProposals: React.FC = () => {
  const proposals: IOracleProposal[] = useSelector(getOracleProposalByNetwork);
  const isFetchingProposals = useSelector(getIsFetchingProposals);
  const [filteredProposals, setFilteredProposals] = useState(proposals);
  const [status, setStatus] = useState<number>(-1);
  const [page, setPage] = useState<number>(1);
  const {
    selectedProposalOrder,
    selectedProposalId,
    setSelectedProposalOrder,
    setSelectedProposalId,
    handleIPFSFetch
  } = useProposalIPFS();
  const selectedProposal = filteredProposals.find((p) => p.proposalId === selectedProposalId);

  const proposalsByStatus = useMemo(() => {
    return groupBy(proposals, 'status')[status] || proposals;
  }, [status, proposals]);

  const handleSelect = (proposal: IOracleProposal, order: number) => {
    handleIPFSFetch(proposal);
    if (proposal?.proposalId === selectedProposalId) {
      setSelectedProposalId('');
      return;
    }
    setSelectedProposalId(proposal.proposalId);
    setSelectedProposalOrder(order);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  useEffect(() => {
    if (!selectedProposal) {
      setSelectedProposalId('');
      return;
    }
    const newOrder =
      filteredProposals.findIndex((p) => p.proposalId === selectedProposal.proposalId) + 1;
    if (newOrder !== selectedProposalOrder) setSelectedProposalOrder(newOrder);
  }, [
    filteredProposals,
    selectedProposal,
    selectedProposalOrder,
    setSelectedProposalId,
    setSelectedProposalOrder
  ]);

  useEffect(() => {
    if (proposalsByStatus.length <= PAGE_SIZE) {
      setFilteredProposals(proposalsByStatus);
      return;
    }
    const start = PAGE_SIZE * (page - 1);
    const end = start + PAGE_SIZE;
    setFilteredProposals(proposalsByStatus.slice(start, end));
  }, [proposalsByStatus, page, setFilteredProposals]);

  const renderContent = () => {
    if (isFetchingProposals) {
      return <Spinner />;
    }

    if (!proposals.length) {
      return <Empty />;
    }

    return (
      <Row gutter={[36, 36]} align="top" wrap>
        {selectedProposal && (
          <Col
            span={24}
            order={selectedProposalOrder}
            xs={{ order: selectedProposalOrder + 1 }}
            md={{ order: Math.ceil(selectedProposalOrder / 2) * 2 + 1 }}
            lg={{ order: Math.ceil(selectedProposalOrder / 3) * 3 + 1 }}
            xl={{ order: Math.ceil(selectedProposalOrder / 4) * 4 + 1 }}>
            <FadeIn>
              <TokenCard.ProposalCardExpand {...selectedProposal} />
            </FadeIn>
          </Col>
        )}
        {filteredProposals.map((item: IOracleProposal, idx: number) => {
          return (
            <Col
              style={{ order: idx + 1 }}
              key={item.proposalId}
              order={idx + 1}
              sm={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
              xl={{ span: 6 }}>
              <FadeIn delay={50 * (idx + 1)}>
                <TokenCard.ProposalCard
                  active={item.proposalId === selectedProposalId}
                  onClick={() => handleSelect(item, idx + 1)}
                  {...item}
                />
              </FadeIn>
            </Col>
          );
        })}
      </Row>
    );
  };

  return (
    <FadeIn>
      <div className="flex mb-8 justify-between items-center">
        <div className="flex items-center gap-4 w-auto md:w-1/2">
          <SearchBar
            onSearch={handleSearch}
            className="w-1/2"
            placeholder="Type to search for a proposal"
          />
          <StatusSelect
            options={[
              { label: 'All', value: -1 },
              ...Object.keys(groupBy(proposals, 'status'))?.map((key) => ({
                label: PROPOSAL_STATUS_MAP[Number(key)].text,
                value: key
              }))
            ]}
            onChange={(val) => {
              setStatus(val);
            }}
          />
        </div>
        <ToNewProposal />
      </div>
      {renderContent()}
      {proposalsByStatus.length > PAGE_SIZE && !isFetchingProposals && (
        <Pagination
          className={cx(styles.pagination, 'mt-6 flex justify-end')}
          defaultCurrent={1}
          pageSize={PAGE_SIZE}
          total={proposalsByStatus.length}
          current={page}
          onChange={(p: number) => setPage(p)}
        />
      )}
    </FadeIn>
  );
};

export default OracleProposals;
