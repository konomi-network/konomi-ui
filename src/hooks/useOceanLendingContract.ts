import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import oceansActions from 'modules/oceans/actions';
import { getOceanLendingContract } from 'modules/connection/reducer';
import { areEqualAddresses, convertToEtherValue } from 'utils/web3';
import useOceanFetch from './useOceanFetch';
import { getSelectedAccount } from 'modules/account/reducer';
import { getIsFetchedOceans, getIsFetchingOceans } from 'modules/oceans/reducer';

const useOceanLendingContract = () => {
  const dispatch = useDispatch();
  const { fetchOceanInfo, fetchOceanLendReward } = useOceanFetch();
  const [payableAmount, setPayableAmount] = useState(0);
  const oceanLendingContract = useSelector(getOceanLendingContract);
  const selectedAccount = useSelector(getSelectedAccount);
  const isFetchedOceans = useSelector(getIsFetchedOceans);
  const isFetchingOceans = useSelector(getIsFetchingOceans);

  const derivePayable = useCallback(
    async (leasePeriod: number) => {
      if (oceanLendingContract) {
        try {
          const result = await oceanLendingContract.derivePayable(BigInt(leasePeriod));
          setPayableAmount(+convertToEtherValue(result.toString()));
        } catch (error) {
          console.log('derivePayable ~ error', error);
        }
      }
    },
    [oceanLendingContract]
  );

  const getOceans = useCallback(async () => {
    try {
      if (oceanLendingContract && selectedAccount && !isFetchingOceans && !isFetchedOceans) {
        dispatch(oceansActions.SET_IS_FETCHING(true));
        const ids = await oceanLendingContract.activePoolIds();
        const pools = await Promise.all(ids.map((id) => oceanLendingContract.getPoolById(+id)));
        const oceans = await Promise.all(
          pools.map((pool, index) => fetchOceanInfo(ids[index], pool))
        );
        const ownerOceans = oceans.filter((ocean) =>
          areEqualAddresses(ocean?.ownerAddress, selectedAccount?.address)
        );
        const oceanWithRewards = await Promise.all(
          ownerOceans.map((ocean) => fetchOceanLendReward(ocean))
        );
        const combinedOceans = oceans
          .filter((ocean) => !areEqualAddresses(ocean?.ownerAddress, selectedAccount?.address))
          .concat(oceanWithRewards);

        dispatch(
          oceansActions.SET_OCEANS(combinedOceans.includes(undefined) ? [] : combinedOceans)
        );
      }
    } catch (error) {
      dispatch(oceansActions.SET_OCEANS([]));
    }
  }, [
    dispatch,
    fetchOceanInfo,
    fetchOceanLendReward,
    isFetchedOceans,
    isFetchingOceans,
    oceanLendingContract,
    selectedAccount
  ]);

  return {
    oceanLendingContract,
    payableAmount,
    setPayableAmount,
    derivePayable,
    getOceans
  };
};

export default useOceanLendingContract;
