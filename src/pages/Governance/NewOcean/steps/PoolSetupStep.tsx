import { useSelector } from 'react-redux';
import cx from 'classnames';
import { Antd, TokenIcon } from 'components';
import { getOceanLendingDefaultParams } from 'modules/common/reducer';
import { ICollateral, ICurrency, IInterest } from 'types/oceanProposal';
import { HintIcon } from 'resources/icons';
import { formatInputValueToNumber } from 'utils/formatter';

import { FormCollapse, Table } from '../components';
import { collateralSettings, interestRateSettings, currencySettings } from '../config';

type TProps = {
  title: React.ReactNode;
  stepValue: number;
  currentStep: number;
  addedCurrencies: ICurrency[];
  selectedCurrency: ICurrency | null;
  handleUpdateCurrencyUnderlying: (v: string) => void;
  handleUpdateCollateral: (v: number | boolean, field: keyof ICollateral) => void;
  handleUpdateInterest: (v: number, field: keyof IInterest) => void;
  onSelectCurrency: (c: ICurrency) => void;
};

const PoolSetupStep: React.FC<TProps> = ({
  title,
  currentStep,
  stepValue,
  addedCurrencies,
  selectedCurrency,
  onSelectCurrency,
  handleUpdateCurrencyUnderlying,
  handleUpdateCollateral,
  handleUpdateInterest
}) => {
  const defaultParams = useSelector(getOceanLendingDefaultParams);

  return (
    <div className="relative mt-20 w-full flex flex-col">
      {title}
      {currentStep === stepValue && (
        <div
          className={cx(
            'rounded mt-11 py-8 bg-[#29263f] border border-primary border-solid',
            'ml-7  px-7 flex justify-between gap-x-7'
          )}>
          <Table
            title="Your currencies"
            className="bg-[#29263f] border border-primary border-solid min-h-[160px] w-[325px]">
            {addedCurrencies.map((c) => (
              <div
                key={c.symbol}
                onClick={() => {
                  if (!selectedCurrency || selectedCurrency.symbol !== c.symbol)
                    onSelectCurrency(c);
                }}
                className={`uppercase flex justify-between items-center cursor-pointer px-3 py-2 hover:bg-tableHoverBg ${
                  selectedCurrency?.symbol === c.symbol ? 'bg-tableHoverBg' : 'bg-transparent'
                }`}>
                <TokenIcon showName name={c.symbol} borderWidth={0} size={24} />
              </div>
            ))}
          </Table>
          {!!addedCurrencies.length && selectedCurrency && (
            <div className="flex-1 flex flex-col gap-y-8">
              <div className="flex-1 flex gap-x-8">
                <FormCollapse
                  className="w-5/12"
                  title="Currency settings"
                  options={currencySettings.map((o) => ({
                    ...o,
                    value: selectedCurrency.underlying,
                    onChange: (v: string) => handleUpdateCurrencyUnderlying(v)
                  }))}
                />
                <FormCollapse
                  className="w-5/12"
                  title="Collateral settings"
                  options={collateralSettings.map((o) => {
                    const canBeCollateral = selectedCurrency.collateral.canBeCollateral;
                    const placeholderCollateralFactor =
                      o.field === 'collateralFactor' && !canBeCollateral
                        ? 0
                        : defaultParams[o.field as keyof ICollateral];

                    return {
                      ...o,
                      hint: !!o.hintLabel && (
                        <Antd.Tooltip placement="top" title={o.hintLabel}>
                          <HintIcon className="ml-2" width={14} height={14} />
                        </Antd.Tooltip>
                      ),
                      value: selectedCurrency.collateral[o.field as keyof ICollateral],
                      props: {
                        disabled: o.field === 'collateralFactor' && !canBeCollateral
                      },
                      placeholder: `e.g. ${placeholderCollateralFactor}`,
                      onChange: (v: string | boolean) => {
                        if (typeof v === 'boolean') {
                          handleUpdateCollateral(v, o.field as keyof ICollateral);
                          return;
                        }
                        handleUpdateCollateral(
                          o.validate ? o.validate(formatInputValueToNumber(v)) : 0,
                          o.field as keyof ICollateral
                        );
                      }
                    };
                  })}
                />
              </div>
              <FormCollapse
                className="w-2/3"
                title="Interest Rate Settings"
                options={interestRateSettings.map((o) => ({
                  ...o,
                  hint: !!o.hintLabel && (
                    <Antd.Tooltip placement="top" title={o.hintLabel}>
                      <HintIcon className="ml-2" width={14} height={14} />
                    </Antd.Tooltip>
                  ),
                  value: selectedCurrency.interest[o.field as keyof IInterest],
                  placeholder: `e.g. ${defaultParams[o.field as keyof IInterest]}`,
                  onChange: (v: string) => {
                    handleUpdateInterest(
                      o.validate(formatInputValueToNumber(v)),
                      o.field as keyof IInterest
                    );
                  }
                }))}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PoolSetupStep;
