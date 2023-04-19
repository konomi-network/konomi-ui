import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'components';
import { areEqualAddresses, getMetamaskRPCErrorMsg } from 'utils/web3';
import { getSelectedAccount } from 'modules/account/reducer';
import useKonoAllowance from './useKonoAllowance';
import useGovernorContract from './useGovernorContract';

type Proposal = {
  status: number;
  proposer: string;
  proposalId: string;
  targetContract: string;
};

const useExecutionRender = (proposal: Proposal) => {
  const { targetContract, status, proposer, proposalId } = proposal;
  const { allowance, isIncreasing, onClickIncreaseAllowance } = useKonoAllowance(targetContract);
  const { isExecuting, execute } = useGovernorContract();
  const selectedAccount = useSelector(getSelectedAccount);
  const [executionError, setExecutionError] = useState('');

  const isProposer = areEqualAddresses(selectedAccount?.address, proposer);

  const renderExecution = () => {
    if (status === 2 && isProposer) {
      return (
        <div className="w-full flex justify-start items-center mx-4 mb-4">
          <Button
            className="px-8 py-1 capitalize"
            isLoading={isIncreasing || isExecuting}
            onClick={() =>
              allowance === 0
                ? onClickIncreaseAllowance()
                : execute(proposalId, (error?: any) => {
                    if (error) setExecutionError(getMetamaskRPCErrorMsg(error)?.message || '');
                  })
            }>
            {allowance === 0 ? 'Increase allowance to execute' : 'Execute'}
          </Button>
          <span className="w-1/2 ml-2 text-left text-error text-md">{executionError}</span>
        </div>
      );
    }
    return null;
  };

  return { renderExecution };
};

export default useExecutionRender;
