import { convertToHex } from 'utils/web3';

describe('convertToHex', () => {
  it('with float number', () => {
    const result = convertToHex(9999.44);
    expect(result).toBeTruthy();
  });

  it('with string', () => {
    const result = convertToHex('9999.44');
    expect(result).toBeTruthy();
  });

  it('with integer', () => {
    const result = convertToHex(1231231);
    expect(result).toBeTruthy();
  });

  it('with integer string', () => {
    const result = convertToHex('1231231');
    expect(result).toBeTruthy();
  });
});
