import { useCallback, useEffect } from 'react';
import FadeIn from 'react-fade-in';
import { Antd } from 'components';
import { PROPOSAL_STATUS_MAP } from 'utils/status';
import { IOracleProposal } from 'types/oracleProposal';
import useProposalIPFS from 'hooks/useProposalIPFS';
import { Card, CardWrapper, Expand, ExpandWrapper } from './';
import styles from './ProposalsRow.module.scss';

const { Row } = Antd;

type TProps = {
  status: number;
  proposals: IOracleProposal[];
};

const ProposalsRow: React.FC<TProps> = ({ proposals, status }: TProps) => {
  const {
    selectedProposalOrder,
    selectedProposalId,
    setSelectedProposalOrder,
    setSelectedProposalId,
    handleIPFSFetch
  } = useProposalIPFS();
  const selectedProposal = proposals.find((p) => p.proposalId === selectedProposalId);

  const handleSelect = (proposal: IOracleProposal, order: number) => {
    handleIPFSFetch(proposal);
    if (proposal?.proposalId === selectedProposalId) {
      setSelectedProposalId('');
      return;
    }
    setSelectedProposalId(proposal.proposalId);
    setSelectedProposalOrder(order);
  };

  const handleUpdateSelected = useCallback(() => {
    if (!selectedProposal) {
      setSelectedProposalId('');
      return;
    }
    const newOrder = proposals.findIndex((p) => p.proposalId === selectedProposal.proposalId) + 1;
    if (newOrder !== selectedProposalOrder) setSelectedProposalOrder(newOrder);
  }, [
    proposals,
    selectedProposal,
    selectedProposalOrder,
    setSelectedProposalId,
    setSelectedProposalOrder
  ]);

  useEffect(() => {
    handleUpdateSelected();
  }, [handleUpdateSelected]);

  return (
    <ProposalsRowWrapper>
      <h2 className={styles.title} style={{ color: PROPOSAL_STATUS_MAP[status].color }}>
        {PROPOSAL_STATUS_MAP[status].text}
      </h2>
      {selectedProposal && (
        <ExpandWrapper order={selectedProposalOrder}>
          <FadeIn>
            <Expand {...selectedProposal} />
          </FadeIn>
        </ExpandWrapper>
      )}
      {proposals.map((item: IOracleProposal, index: number) => (
        <CardWrapper key={item.proposalId} order={index + 1}>
          <FadeIn delay={100 * (index + 1)}>
            <Card
              isActive={item.proposalId === selectedProposal?.proposalId}
              onClick={() => handleSelect(item, index + 1)}
              {...item}
            />
          </FadeIn>
        </CardWrapper>
      ))}
    </ProposalsRowWrapper>
  );
};

const ProposalsRowWrapper = (props: any) => (
  <Row
    {...props}
    className="relative w-full flex-auto"
    gutter={[
      { sm: 24, md: 32, lg: 48 },
      { xs: 16, sm: 24, md: 32, lg: 48 }
    ]}></Row>
);

export { ProposalsRowWrapper, ProposalsRow };

export default ProposalsRow;
