import { useEffect, useState } from 'react';
import { batch, useDispatch } from 'react-redux';
import commonActions from 'modules/common/actions';
import connectionActions from 'modules/connection/actions';
import proposalsActions from 'modules/proposals/actions';
import fetch from 'utils/fetch';

const useFetchConfigData = () => {
  const [error, setError] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const dispatch = useDispatch();
  const setProposalSchemas = proposalsActions.SET_CONFIG;
  const setCommonSchemas = commonActions.SET_SCHEMAS;
  const setConfigData = commonActions.SET_CONFIG;
  const setImages = commonActions.SET_IMAGES;
  const setAbiAndAddress = connectionActions.SET_ABI_AND_ADDRESS;

  useEffect(() => {
    const requestsArray: any[] = [
      '/config',
      '/schemas/proposal',
      '/schemas/subscription',
      '/schemas/contract',
      '/currencies/images',
      '/dataSources/images'
    ].map((url) => fetch(url));

    Promise.all(requestsArray)
      .then(
        ([
          configData,
          proposalData,
          subscriptionData,
          contractData,
          currencyImages,
          dataSourceImages
        ]: any[]) => {
          const payload = {
            stakingAbi: contractData.stakingV1.abi,
            konoAbi: contractData.kono.abi,
            oracleAbi: contractData.oracleSubscription.abi,
            governorAbi: contractData.konomiGovernor?.abi || [],
            jumpInterestV2Abi: contractData.jumpInterestV2?.abi || [],
            comptrollerAbi: contractData.comptroller?.abi || [],
            oceanLendingAbi: contractData.oceanLending?.abi || [],
            oTokenAbi: contractData.oToken?.abi || [],

            stakingAddresses: contractData.stakingV1.addresses,
            konoAddresses: contractData.kono.addresses,
            oracleAddresses: contractData.oracleSubscription.addresses,
            oceanLendingAddresses: contractData.oceanLending?.addresses || [],
            governorAddresses: contractData.konomiGovernor?.addresses || []
          };
          batch(() => {
            dispatch(setConfigData(configData));
            dispatch(setProposalSchemas(proposalData));
            dispatch(setCommonSchemas(subscriptionData));
            dispatch(setImages(currencyImages));
            dispatch(setImages(dataSourceImages));
            dispatch(setAbiAndAddress(payload));
          });
        }
      )
      .catch((err: any) => {
        console.log('useFetchConfigData.ts ~ err', err);
        setError(err.message);
      })
      .finally(() => {
        setIsFetching(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [isFetching, error];
};

export default useFetchConfigData;
