import { IOcean, IOceanCurrencyInfo } from 'types/ocean';
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Comptroller,
  OToken,
  JumpInterestV2,
  PriceOracleAdaptor,
  ERC20Token
} from '@konomi-network/client';
import { PoolData } from '@konomi-network/client/dist/config';

import { convertToEtherValue, areEqualAddresses } from 'utils/web3';
import { getSelectedAccount } from 'modules/account/reducer';
import {
  getComptrollerAbi,
  getCurrentNetworkId,
  getJumpInterestV2Abi,
  getOTokenAbi
} from 'modules/connection/reducer';
import { getBlockTime } from 'modules/common/reducer';
import oceansActions from 'modules/oceans/actions';
import priceOracleAbi from 'abi/priceOracleAdaptor.json';
import erc20Abi from 'abi/erc20.json';
import useActiveWeb3React from './useActiveWeb3React';

const useOceanFetch = () => {
  const dispatch = useDispatch();
  const { library } = useActiveWeb3React();
  const networkId = useSelector(getCurrentNetworkId);
  const blockTime = useSelector(getBlockTime);
  const oTokenAbi = useSelector(getOTokenAbi);
  const jumpInterestV2Abi = useSelector(getJumpInterestV2Abi);
  const comptrollerAbi = useSelector(getComptrollerAbi);
  const selectedAccount = useSelector(getSelectedAccount);

  const fetchOceanInfo = useCallback(
    async (oceanId: string, ocean: PoolData): Promise<IOcean | void> => {
      if (
        selectedAccount &&
        library &&
        jumpInterestV2Abi &&
        comptrollerAbi &&
        networkId !== undefined
      ) {
        try {
          const comptroller = new Comptroller(library, comptrollerAbi, ocean.deployContract);
          const priceOracleAddress = await comptroller.oracleAddress();
          const priceOracle = new PriceOracleAdaptor(library, priceOracleAbi, priceOracleAddress);

          const oceanMarketSummary = await comptroller.getOceanMarketSummary(
            blockTime,
            priceOracle
          );
          const {
            markets,
            totalSupplyUSD,
            maxSupplyAPY,
            minBorrowAPY,
            closeFactor,
            liquidationIncentive
          } = oceanMarketSummary;

          const {
            borrowLimit,
            totalSupplyUSD: accountSupplyUSD,
            totalBorrowUSD: accountBorrowUSD
          } = await comptroller.getAccountSummary(selectedAccount.address, oceanMarketSummary);

          const oTokenContracts = markets.map(
            (m) => new OToken(library, oTokenAbi, m.address, {} as any, {} as any)
          );
          const ercTokenContracts = markets.map(
            (m) => new ERC20Token(library, erc20Abi, m.underlying)
          );
          const underlyingSymbols = await Promise.all(ercTokenContracts.map((c) => c.symbol()));

          const jumpInterestAddresses = await Promise.all(
            oTokenContracts.map((c) => c.interestRateModel())
          );
          const jumpInterestContracts = jumpInterestAddresses.map(
            (address) => new JumpInterestV2(library, jumpInterestV2Abi, address)
          );

          // Interest rate
          const baseRatePerYearArr = await Promise.all(
            jumpInterestContracts.map((c) => c.baseRatePerYear())
          );
          const multiplierPerYearArr = await Promise.all(
            jumpInterestContracts.map((c) => c.multiplierPerYear())
          );
          const jumpMultiplierPerYearArr = await Promise.all(
            jumpInterestContracts.map((c) => c.jumpMultiplierPerYear())
          );
          const kinkArr = await Promise.all(jumpInterestContracts.map((c) => c.kink()));
          //

          const collateralFactors = await Promise.all(
            markets.map((m) => comptroller.collateralFactor(m.address))
          );

          const oTokenDetailArr = await Promise.all(
            oTokenContracts.map((c) => c.getOTokenSummary(selectedAccount.address))
          );

          const currencies: IOceanCurrencyInfo[] = markets.map((m, index) => ({
            oTokenAddress: markets[index].address,
            totalSupply: m.totalSupply,
            totalBorrow: m.totalBorrow,
            totalSupplyUSD: m.totalSupplyUSD,
            totalBorrowUSD: m.totalBorrowUSD,
            supplyAPY: m.supplyAPY,
            borrowAPY: m.borrowAPY,
            liquidity: m.totalSupply - m.totalBorrow,
            underlyingPrice: m.price,
            underlyingAddress: m.underlying,
            underlyingSymbol: underlyingSymbols[index],
            collateralFactor: collateralFactors[index],
            canBeCollateral: !!collateralFactors[index],
            accountSupplyAmount: oTokenDetailArr[index].supplyAmount,
            accountBorrowAmount: oTokenDetailArr[index].borrowAmount,
            interest: {
              baseRatePerYear: +convertToEtherValue(baseRatePerYearArr[index].toString()) * 100,
              multiplierPerYear: +convertToEtherValue(multiplierPerYearArr[index].toString()) * 100,
              jumpMultiplierPerYear:
                +convertToEtherValue(jumpMultiplierPerYearArr[index].toString()) * 100,
              kink: +convertToEtherValue(kinkArr[index].toString()) * 100
            }
          }));

          return {
            id: oceanId,
            status: ocean.suspended ? 2 : 1,
            priceOracleAddress,
            contractAddress: ocean.deployContract,
            ownerAddress: ocean.owner,
            maxSupplyAPY,
            minBorrowAPY,
            liquidationIncentive,
            closeFactor,
            accountBorrowLimit: borrowLimit,
            accountSupplyUSD,
            accountBorrowUSD,
            currencies,
            leaseEnd: Number(ocean.leaseEnd),
            leaseStart: Number(ocean.leaseStart),
            totalLiquidity: totalSupplyUSD
          };
        } catch (error) {
          console.log('useOceanFetch.ts ~ error', error);
        }
      }
    },
    [selectedAccount, library, jumpInterestV2Abi, comptrollerAbi, networkId, oTokenAbi, blockTime]
  );

  const fetchOceanCurrencyInfo = useCallback(
    async (ocean: IOcean, currencyInfo: IOceanCurrencyInfo) => {
      if (selectedAccount && library && comptrollerAbi) {
        const comptroller = new Comptroller(library, comptrollerAbi, ocean.contractAddress);
        const priceOracle = new PriceOracleAdaptor(
          library,
          priceOracleAbi,
          ocean.priceOracleAddress
        );
        const oTokenContract = new OToken(
          library,
          oTokenAbi,
          currencyInfo.oTokenAddress,
          {} as any,
          {} as any
        );
        const oceanMarketSummary = await comptroller.getOceanMarketSummary(blockTime, priceOracle);
        const { totalSupplyUSD: totalLiquidity, markets } = oceanMarketSummary;

        const {
          borrowLimit: accountBorrowLimit,
          totalSupplyUSD: accountSupplyUSD,
          totalBorrowUSD: accountBorrowUSD
        } = await comptroller.getAccountSummary(selectedAccount.address, oceanMarketSummary);

        const market = markets.find((m) =>
          areEqualAddresses(m.address, currencyInfo.oTokenAddress)
        );
        const { supplyAmount, borrowAmount } = await oTokenContract.getOTokenSummary(
          selectedAccount.address
        );

        const {
          totalSupply,
          totalSupplyUSD,
          totalBorrow,
          totalBorrowUSD,
          supplyAPY,
          borrowAPY,
          price
        } = market!;

        dispatch(
          oceansActions.UPDATE_OCEAN_CURRENCY({
            id: ocean.id,
            totalLiquidity,
            accountBorrowLimit,
            accountSupplyUSD,
            accountBorrowUSD,
            currency: {
              ...currencyInfo,
              underlyingPrice: price,
              supplyAPY,
              borrowAPY,
              totalSupply,
              totalBorrow,
              totalSupplyUSD,
              totalBorrowUSD,
              liquidity: totalSupply - totalBorrow,
              accountSupplyAmount: supplyAmount,
              accountBorrowAmount: borrowAmount
            }
          })
        );
      }
    },
    [selectedAccount, library, comptrollerAbi, oTokenAbi, blockTime, dispatch]
  );

  const fetchOceanLendReward = useCallback(
    async (ocean: void | IOcean) => {
      try {
        if (selectedAccount && library && comptrollerAbi && ocean) {
          const comptroller = new Comptroller(library, comptrollerAbi, ocean.contractAddress);
          const priceOracle = new PriceOracleAdaptor(
            library,
            priceOracleAbi,
            ocean.priceOracleAddress
          );
          const { markets } = await comptroller.getOceanMarketSummary(blockTime, priceOracle);

          const marketsWithDecimals = markets.map((m) => {
            return { address: m.address, underlyingDecimals: m.underlyingDecimals };
          });

          const rewards = await comptroller.getOceanMasterRewards(marketsWithDecimals);

          return { ...ocean, rewards };
        }
      } catch (error) {
        return ocean;
      }
    },
    [selectedAccount, library, comptrollerAbi, blockTime]
  );

  return {
    fetchOceanInfo,
    fetchOceanCurrencyInfo,
    fetchOceanLendReward
  };
};

export default useOceanFetch;
