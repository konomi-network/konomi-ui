const poolInfoFields = [
  { label: 'Address', type: 'text', style: 'address', field: 'underlyingAddress', value: '' },
  { label: 'Liquidity', type: 'text', field: 'liquidity', value: '' },
  { label: 'Borrow APY', type: 'text', style: 'percentage', field: 'borrowAPY', value: '' },
  { label: 'Supply APY', type: 'text', style: 'percentage', field: 'supplyAPY', value: '' },
  { label: 'Total borrow', type: 'text', field: 'totalBorrow', value: '' },
  { label: 'Total supply', type: 'text', field: 'totalSupply', value: '' }
];

const collateralSettingFields = [
  { label: 'Can be collateral', type: 'radio', field: 'canBeCollateral', value: '' },
  {
    label: 'Collateral factor',
    type: 'text',
    style: 'percentage',
    field: 'collateralFactor',
    value: '',
    defaultValue: 0
  }
];

const interestRateSettingFields = [
  {
    label: 'Base rate per year',
    type: 'text',
    style: 'percentage',
    field: 'baseRatePerYear',
    value: '',
    defaultValue: 0
  },
  {
    label: 'Multiplier per year',
    type: 'text',
    style: 'percentage',
    field: 'multiplierPerYear',
    value: '',
    defaultValue: 0
  },
  {
    label: 'Jump multiplier per year',
    type: 'text',
    style: 'percentage',
    field: 'jumpMultiplierPerYear',
    value: '',
    defaultValue: 0
  },
  { label: 'Kink', type: 'text', style: 'percentage', field: 'kink', value: '', defaultValue: 0 }
];

export default {
  poolInfoFields,
  interestRateSettingFields,
  collateralSettingFields
};
