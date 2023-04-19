import { isContractAddress } from 'utils/web3';
import { format as d3format, formatPrefix as d3formatPrefix } from 'd3-format';
import isInteger from 'lodash/isInteger';

const displayFloat = (value: number, decimals: number = 2): string => {
  if (value === 0) return '0';
  return value === undefined ? '--' : `${d3format(`,.${decimals}f`)(value)}`;
};

const displayFloatPrefix = (value: number, decimals?: number): string => {
  if (value === 0) return '0';
  let prefixValue = 1;
  if (value >= 1e3) {
    prefixValue = 1e3;
  }
  if (value >= 1e6) {
    prefixValue = 1e6;
  }
  if (value >= 1e9) {
    prefixValue = 1e9;
  }

  return value === undefined
    ? '--'
    : `${d3formatPrefix(`,.${decimals || 2}f`, prefixValue)(value).replace(/G/, 'B')}`;
};

const displayAddress = (address: string = '', offset: number = 4): string => {
  if (!address) return '--';
  if (!isContractAddress(address)) {
    return offset > address.length ? address : address.slice(0, offset);
  }

  return address.slice(0, offset) + '...' + address.slice(-offset);
};

const uint8toString = (input: number[]): string => {
  let dataString = '';
  for (const v of input) {
    dataString += String.fromCharCode(v);
  }
  return dataString;
};

const formatInputValueToNumber = (input: string | number, fixed?: number) => {
  if (isInteger(input)) return +input;
  return +Number.parseFloat(input + '').toFixed(fixed || 2);
};

const getPrecision = (numberAsString: string) => {
  const n = numberAsString.split('.');
  return n.length > 1 ? n[1].length : 0;
};

const toFixedDown = (input: string, fixed: number = 2): string => {
  if (isInteger(+input)) return input;
  if (getPrecision(input) <= fixed) return input;

  const mantissa = 10 ** fixed;
  return (Math.floor(Number.parseFloat(input) * mantissa) / mantissa).toFixed(fixed);
};

/**
 * Display price with $ as pre decoration
 * @param value price value with decimals on chain
 * @param tokenDecimals decimals of token contract
 * @param displayDecimals decimals of value display
 */
const displayPrice = (
  value: number,
  tokenDecimals: number,
  displayDecimals: number = 4
): string => {
  const actualPrice = value / 10 ** tokenDecimals;
  if (actualPrice < 1e-4) {
    return actualPrice.toExponential(displayDecimals);
  }
  return displayFloat(actualPrice, displayDecimals);
};

export {
  getPrecision,
  toFixedDown,
  displayPrice,
  displayFloat,
  displayFloatPrefix,
  displayAddress,
  uint8toString,
  formatInputValueToNumber
};
