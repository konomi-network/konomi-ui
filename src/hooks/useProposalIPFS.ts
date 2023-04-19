import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useIPFSClient } from 'contexts/IPFSClient';
import { IOracleProposal, IProposalIPFS } from 'types/oracleProposal';
import proposalsActions from 'modules/proposals/actions';
import { uint8toString } from 'utils/formatter';

const useProposalIPFS = () => {
  const ipfs = useIPFSClient();
  const dispatch = useDispatch();
  const [selectedProposalId, setSelectedProposalId] = useState<string>('');
  const [selectedProposalOrder, setSelectedProposalOrder] = useState<number>(0);

  const expandIPFSData = (data: { id: string; data: any }) =>
    dispatch(proposalsActions.SET_DATA_FROM_IPFS(data));

  const handleIPFSFetch = async (proposal: IOracleProposal) => {
    const { proposalDetail, proposalId, ipfsData, ipfsError } = proposal;
    const cid = proposalDetail.externalStorageHash;

    if (cid && !ipfsData && !ipfsError) {
      try {
        const result = await ipfs?.find(cid);
        if (result) {
          const unit8array = result?.split(',')?.map((i) => +i);
          const contentString = uint8toString(unit8array);
          const contentObj: IProposalIPFS = JSON.parse(contentString);
          expandIPFSData({
            id: proposalId,
            data: contentObj
          });
        }
      } catch (error) {
        expandIPFSData({
          id: proposalId,
          data: { ipfsError: true }
        });
      }
    }
  };

  return {
    ipfs,
    selectedProposalId,
    selectedProposalOrder,
    expandIPFSData,
    handleIPFSFetch,
    setSelectedProposalId,
    setSelectedProposalOrder
  };
};

export default useProposalIPFS;
