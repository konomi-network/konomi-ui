import Web3 from 'web3';
import { Unit } from 'web3-utils';
import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { CHAIN_RPC_LINK, FALLBACK_CHAIN_IDS } from 'config/chains';

import KONO_LOGO from 'resources/img/KONO.png';

dayjs.extend(duration);

export const getInjectedConnector = (chainIds: number[]) =>
  new InjectedConnector({
    supportedChainIds: chainIds.length > 0 ? chainIds : FALLBACK_CHAIN_IDS
  });

export const getWalletlinkConnector = (chainIds: number[]) =>
  new WalletLinkConnector({
    url: CHAIN_RPC_LINK(chainIds.length > 0 ? chainIds[0] : FALLBACK_CHAIN_IDS[0]),
    appName: 'Konomi Tech',
    appLogoUrl: KONO_LOGO,
    supportedChainIds: chainIds
  });

export const getWalletConnectConnector = (chainIds: number[]) =>
  new WalletConnectConnector({
    supportedChainIds: chainIds.length > 0 ? chainIds : FALLBACK_CHAIN_IDS,
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true
  });

export const getLibrary = (provider: any) => new Web3(provider);

export const getNegativeOne = () => {
  return Web3.utils.toHex(Web3.utils.toBN(2).pow(Web3.utils.toBN(256)).sub(Web3.utils.toBN(1)));
};

export const convertBNtoTokens = (value: string | number, decimals?: number): number => {
  const decimalBN = Web3.utils.toBN(10).pow(Web3.utils.toBN(decimals || 18));
  const numberValue = Web3.utils.toBN(value).div(decimalBN).toNumber();
  const modValue = Web3.utils.toBN(value).mod(decimalBN).toString();
  const floatingValue = +((modValue as any) / Math.pow(10, decimals || 18)).toFixed(6);
  return numberValue + floatingValue;
};

export const convertToEtherValue = (value: string | number, decimalUnit?: Unit): string => {
  return Web3.utils.fromWei(value.toString(), decimalUnit);
};

export const convertToHex = (value: string | number, decimalUnit?: Unit): string => {
  const stringValue = value + '';
  const weiValue = Web3.utils.toWei(stringValue, decimalUnit);
  return Web3.utils.toHex(weiValue);
};

export const isContractAddress = (address: string) => Web3.utils.isAddress(address);

export const areEqualAddresses = (add1: string = '', add2: string = '') => {
  if (!isContractAddress(add1) || !isContractAddress(add2)) return false;

  return Web3.utils.toChecksumAddress(add1) === Web3.utils.toChecksumAddress(add2);
};

export const calculateStakingAPR = (blockTime: number, konoPerBlock: string | number): number => {
  const secondsPerYear = 60 * 60 * 24 * 365;
  const blocksPerYear = secondsPerYear / blockTime;
  const apr = Web3.utils.toBN(blocksPerYear).mul(Web3.utils.toBN(konoPerBlock));
  return +Web3.utils.fromWei(apr);
};

export const getMetamaskRPCErrorMsg = (error: object) => {
  const errString = error.toString();
  if (errString.indexOf('Internal JSON-RPC error.') > -1) {
    const errorContentString = errString
      .replace('\n', '')
      .replace('Error: ', '')
      .replace('Internal JSON-RPC error.', '');
    return JSON.parse(errorContentString);
  }

  return 'Error';
};

/**
 * Get time in days from blocks
 * @param blockNumber number of block
 * @param blockTime seconds
 */
export const getTimeFromBlock = (blockNumber: number, blockTime: number): string => {
  if (blockNumber <= 0) return '';
  const seconds = blockNumber * blockTime;
  const durationTime = dayjs.duration({ seconds });
  if (seconds < 60) return seconds + ' seconds';
  if (seconds < 3600) return durationTime.asMinutes().toFixed(1) + ' minutes';
  if (seconds < 86400) return durationTime.asHours().toFixed(1) + ' hours';
  if (seconds < 2678400) return durationTime.asDays().toFixed(1) + ' days';

  return durationTime.asMonths().toFixed(1) + ' months';
};
