import { useSelector } from 'react-redux';
import { getClientMap } from 'modules/common/reducer';
import { IProposalClient } from 'types/oracleProposal';

const useClient = (client: IProposalClient | undefined) => {
  const clientMap = useSelector(getClientMap);
  const clientName = client?.clientType === undefined ? '' : clientMap[client?.clientType];
  const clientConnectionInfo = client?.connectionInfo?.[0]?.detail || {};

  return {
    clientMap,
    clientName,
    clientConnectionInfo
  };
};

export default useClient;
