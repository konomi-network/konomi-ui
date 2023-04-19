export enum SupportedChainId {
  ETHEREUM_MAINNET = 1,
  ROPSTEN = 3,
  RINKEBY = 4,
  GOERLI = 5,
  KOVAN = 42,
  BSC_TESTNET = 97,
  BSC = 56,

  ARBITRUM_ONE = 42161,
  ARBITRUM_RINKEBY = 421611,

  OPTIMISM = 10,
  OPTIMISTIC_KOVAN = 69,

  POLYGON = 137,
  POLYGON_MUMBAI = 80001
}
export const FALLBACK_CHAIN_IDS = [SupportedChainId.BSC_TESTNET, SupportedChainId.POLYGON_MUMBAI];

export const CHAIN_RPC_LINK = (chainId: number) => {
  switch (chainId) {
    case SupportedChainId.ETHEREUM_MAINNET:
      return 'https://mainnet.infura.io/v3';
    case SupportedChainId.POLYGON:
      return 'https://polygon-rpc.com';
    case SupportedChainId.POLYGON_MUMBAI:
      return 'https://rpc-endpoints.superfluid.dev/mumbai';
    case SupportedChainId.BSC_TESTNET:
      return 'https://data-seed-prebsc-1-s1.binance.org:8545';
    default:
  }
  throw new Error('RPC URLs must use public endpoints');
};

export const CHAIN_RPC_URLS = (chainId: number) => {
  switch (chainId) {
    case SupportedChainId.ETHEREUM_MAINNET:
      return ['https://mainnet.infura.io/v3'];
    case SupportedChainId.POLYGON:
      return ['https://polygon-rpc.com'];
    case SupportedChainId.POLYGON_MUMBAI:
      return ['https://rpc-endpoints.superfluid.dev/mumbai'];
    case SupportedChainId.BSC_TESTNET:
      return ['https://data-seed-prebsc-1-s1.binance.org:8545'];
    default:
  }
  throw new Error('RPC URLs must use public endpoints');
};

interface BaseChainInfo {
  readonly blockWaitMsBeforeWarning?: number;
  readonly bridge?: string;
  readonly explorer: string;
  readonly label: string;
  readonly helpCenterUrl?: string;
}

export enum NetworkType {
  L1,
  L2
}

interface BaseChainInfo {
  readonly networkType: NetworkType;
  readonly blockWaitMsBeforeWarning?: number;
  readonly docs: string;
  readonly bridge?: string;
  readonly explorer: string;
  readonly infoLink: string;
  readonly label: string;
  readonly helpCenterUrl?: string;
  readonly nativeCurrency: {
    name: string; // e.g. 'Goerli ETH',
    symbol: string; // e.g. 'gorETH',
    decimals: number; // e.g. 18,
  };
}

export const CHAIN_INFO: { [key: number]: BaseChainInfo } = {
  [SupportedChainId.BSC_TESTNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.binance.org/',
    explorer: 'https://testnet.bscscan.com/',
    infoLink: 'https://info.binance.org/#/',
    label: 'Binance Testnet',
    nativeCurrency: { name: 'Binance Native Coin', symbol: 'BNB', decimals: 18 }
  },
  [SupportedChainId.ETHEREUM_MAINNET]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ethereum',
    nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
  },
  [SupportedChainId.RINKEBY]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://rinkeby.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Rinkeby',
    nativeCurrency: { name: 'Rinkeby Ether', symbol: 'rETH', decimals: 18 }
  },
  [SupportedChainId.ROPSTEN]: {
    networkType: NetworkType.L1,
    docs: 'https://docs.uniswap.org/',
    explorer: 'https://ropsten.etherscan.io/',
    infoLink: 'https://info.uniswap.org/#/',
    label: 'Ropsten',
    nativeCurrency: { name: 'Ropsten Ether', symbol: 'ropETH', decimals: 18 }
  },
  [SupportedChainId.POLYGON]: {
    networkType: NetworkType.L1,
    bridge: 'https://wallet.polygon.technology/bridge',
    docs: 'https://polygon.io/',
    explorer: 'https://polygonscan.com/',
    infoLink: 'https://info.uniswap.org/#/polygon/',
    label: 'Polygon',
    nativeCurrency: { name: 'Polygon Matic', symbol: 'MATIC', decimals: 18 }
  },
  [SupportedChainId.POLYGON_MUMBAI]: {
    networkType: NetworkType.L1,
    bridge: 'https://wallet.polygon.technology/bridge',
    docs: 'https://polygon.io/',
    explorer: 'https://mumbai.polygonscan.com/',
    infoLink: 'https://info.uniswap.org/#/polygon/',
    label: 'Polygon Mumbai',
    nativeCurrency: { name: 'Polygon Mumbai Matic', symbol: 'mMATIC', decimals: 18 }
  }
};
