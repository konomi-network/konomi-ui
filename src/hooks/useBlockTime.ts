import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getBlockTime } from 'modules/common/reducer';

const useBlockTime = () => {
  const blockTime = useSelector(getBlockTime);

  const reloadTime = useMemo(() => {
    if (blockTime <= 0) return null;
    return blockTime * 8 * 1000;
  }, [blockTime]);

  const proposalReloadTime = useMemo(() => {
    if (blockTime <= 0) return null;
    return blockTime * 20 * 1000;
  }, [blockTime]);

  return { blockTime, reloadTime, proposalReloadTime };
};

export default useBlockTime;
