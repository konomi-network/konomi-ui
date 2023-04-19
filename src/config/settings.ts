export const DOMAIN_URL: { [key: string]: string } = {
  api: process.env.REACT_APP_API_DOMAIN || 'https://dev.konomi.tech/apis',
  websocket: process.env.REACT_APP_WS_DOMAIN || 'wss://dev.konomi.tech/apis/websocket',
  ipfs: process.env.REACT_APP_IPFS_DOMAIN || 'https://ipfs.infura.io:5001'
};

export const PLATFORM: { [key: string]: string } = {
  tokenName: process.env.REACT_APP_PLATFORM_TOKEN_NAME || 'KONO'
};
