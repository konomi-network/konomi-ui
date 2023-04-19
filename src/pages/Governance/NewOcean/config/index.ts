const collateralSettings = [
  {
    label: 'Can be collateral',
    field: 'canBeCollateral',
    type: 'radio'
  },
  {
    validate: (value: number) => {
      if (value < 0) return 0;
      if (value > 80) return 80;
      return value;
    },
    label: 'Collateral factor (%)',
    hintLabel: 'Collateral factor must be from 0% to 80%',
    field: 'collateralFactor',
    type: 'number'
  }
];

const interestRateSettings = [
  {
    validate: (value: number) => {
      if (value < 0) return 0;
      if (value > 100) return 100;
      return value;
    },
    label: 'Base rate per year (%)',
    hintLabel: 'Base rate per year must be from 0% to 100%',
    field: 'baseRatePerYear',
    type: 'number'
  },
  {
    validate: (value: number) => {
      if (value < 0) return 0;
      return value;
    },
    label: 'Multiplier per year (%)',
    hintLabel: 'Multiplier per year must be greater than 0%',
    field: 'multiplierPerYear',
    type: 'number'
  },
  {
    validate: (value: number) => {
      if (value < 0) return 0;
      return value;
    },
    label: 'Jump multiplier per year (%)',
    hintLabel: 'Jump multiplier per year must be greater than 0%',
    field: 'jumpMultiplierPerYear',
    type: 'number'
  },
  {
    validate: (value: number) => {
      if (value < 0) return 0;
      return value;
    },
    label: 'Kink (%)',
    hintLabel: 'Kink must be greater than 0% and base rate',
    field: 'kink',
    type: 'number'
  }
];

const currencySettings = [
  { label: 'Address', type: 'text', style: 'address', field: 'underlying' }
];

const steps = [
  {
    value: 1,
    label: 'Select your currencies'
  },
  {
    value: 2,
    label: 'Ocean config'
  },
  {
    value: 3,
    label: 'Set up your pool'
  }
];

export { collateralSettings, interestRateSettings, currencySettings, steps };
