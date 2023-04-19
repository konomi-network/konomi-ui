import { useCallback, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { PriceOracleAdaptor } from '@konomi-network/client';
import { getSelectedAccount } from 'modules/account/reducer';
import useIsMounted from './useIsMounted';
import useActiveWeb3React from './useActiveWeb3React';
import priceOracleAbi from 'abi/priceOracleAdaptor.json';

const usePriceOracleAdaptor = (priceOracleAddress: string) => {
  const isMounted = useIsMounted();
  const { library } = useActiveWeb3React();
  const selectedAccount = useSelector(getSelectedAccount);
  const [price, setPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [priceOracleAdaptor, setPriceOracleAdaptor] = useState<PriceOracleAdaptor | null>(null);

  const getUnderlyingPrice = useCallback(
    (oTokenAddress: string) => {
      if (priceOracleAdaptor && selectedAccount) {
        if (isMounted()) {
          setIsLoading(true);
          priceOracleAdaptor
            .getUnderlyingPrice(oTokenAddress)
            .then((result) => {
              setPrice(result);
            })
            .catch((error: any) => {
              if (error && isMounted()) setPrice('');
            });
        }
      }
    },
    [priceOracleAdaptor, selectedAccount, isMounted]
  );

  useEffect(() => {
    if (library && selectedAccount)
      setPriceOracleAdaptor(new PriceOracleAdaptor(library, priceOracleAbi, priceOracleAddress));
  }, [selectedAccount, library, priceOracleAddress]);

  return { priceOracleAdaptor, isLoading, price, getUnderlyingPrice };
};

export default usePriceOracleAdaptor;
