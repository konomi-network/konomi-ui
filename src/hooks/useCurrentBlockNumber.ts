import { useEffect, useState, useCallback } from 'react';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useIsMounted from './useIsMounted';

const useCurrentBlockNumber = () => {
  const { library } = useActiveWeb3React();
  const isMounted = useIsMounted();
  const [currentBlock, setCurrentBlock] = useState(0);
  const [isFetching, setIsFetching] = useState(false);

  const getCurrentBlockNumber = useCallback(async () => {
    if (library) {
      setIsFetching(true);
      const block = await library?.eth.getBlockNumber();
      if (isMounted()) {
        setCurrentBlock(block);
        setIsFetching(false);
      }
    }
  }, [isMounted, library]);

  useEffect(() => {
    getCurrentBlockNumber();
  }, [getCurrentBlockNumber]);

  return { currentBlock, isCurrentBlockFetching: isFetching };
};

export default useCurrentBlockNumber;
