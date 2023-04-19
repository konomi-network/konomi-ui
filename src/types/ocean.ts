export interface IOceanCurrencyInfo {
  oTokenAddress: string;
  underlyingAddress: string;
  underlyingSymbol: string;
  underlyingPrice: number;
  collateralFactor: number;
  canBeCollateral: boolean;
  liquidity: number;
  borrowAPY: number;
  supplyAPY: number;
  totalSupply: number;
  totalBorrow: number;
  totalSupplyUSD: number;
  totalBorrowUSD: number;
  accountSupplyAmount: number;
  accountBorrowAmount: number;
  interest: {
    baseRatePerYear: number;
    multiplierPerYear: number;
    jumpMultiplierPerYear: number;
    kink: number;
  };
}

export interface IAccount {
  accountSupplyUSD: number;
  accountBorrowUSD: number;
}
export interface IOcean {
  id: string;
  ownerAddress: string;
  contractAddress: string;
  priceOracleAddress: string;
  accountBorrowLimit: number;
  accountSupplyUSD: number;
  accountBorrowUSD: number;
  status: number;
  totalLiquidity: number;
  closeFactor: number;
  liquidationIncentive: number;
  minBorrowAPY: number;
  maxSupplyAPY: number;
  leaseEnd: number;
  leaseStart: number;
  currencies: IOceanCurrencyInfo[];
  rewards?: Map<string, number>;

  // for reload info
  isLoading?: boolean;
}
