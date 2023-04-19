import { useSelector } from 'react-redux';
import cx from 'classnames';
import { Button, Selector } from 'components';
import { getOceanLeasePeriodOptions, getOceanLendingDefaultParams } from 'modules/common/reducer';

type TProps = {
  title: React.ReactNode;
  stepValue: number;
  currentStep: number;
  formValues: {
    leasePeriod: number;
    closeFactor: number;
    liquidationIncentive: number;
  };
  onCloseFactorChange: (value: number) => void;
  onLiquidationIncentiveChange: (value: number) => void;
  onLeasePeriodChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
};

const OceanConfigStep: React.FC<TProps> = ({
  title,
  currentStep,
  stepValue,
  formValues,
  onCloseFactorChange,
  onLiquidationIncentiveChange,
  onLeasePeriodChange,
  onBack,
  onNext
}) => {
  const oceanLeasePeriodOptions = useSelector(getOceanLeasePeriodOptions);
  const defaultParams = useSelector(getOceanLendingDefaultParams);

  const validationRules = {
    closeFactor: {
      errorMsg: 'Close factor must be higher than 20%',
      validate: function (value: number) {
        if (value > 20) return '';
        return this.errorMsg;
      }
    },
    liquidationIncentive: {
      errorMsg: 'Liquidation incentive must be from 1 to 2',
      validate: function (value: number) {
        if (value <= 2 && value >= 1) return '';
        return this.errorMsg;
      }
    }
  };

  const isNextDisabled = () => {
    for (const field in validationRules) {
      if (
        !!validationRules[field as 'closeFactor' | 'liquidationIncentive'].validate(
          formValues[field as 'closeFactor' | 'liquidationIncentive']
        )
      )
        return true;
    }
    return false;
  };

  return (
    <div className="relative mt-20 w-full flex flex-col">
      {title}
      {currentStep > stepValue && (
        <Button className="capitalize absolute right-0 py-1 w-32 text-sm" onClick={() => onBack()}>
          Back step
        </Button>
      )}
      {currentStep === stepValue && (
        <div
          className={cx(
            'ml-60 px-10 flex flex-col justify-between items-start text-left gap-y-6 relative w-[345px]',
            'rounded mt-11 py-8 bg-[#29263f] border border-primary border-solid'
          )}>
          <div className="w-full relative">
            <span className="block text-primary font-bold text-lg mb-1">Close Factor (%)</span>
            <input
              onChange={(e) => onCloseFactorChange(e.target.valueAsNumber)}
              className="w-full px-3 py-2 outline-none rounded-md bg-[#2a324d]"
              value={isNaN(formValues.closeFactor) ? '' : formValues.closeFactor}
              type="number"
              placeholder={`Close factor percentage e.g. ${defaultParams.closeFactor}`}
            />
            <span className="text-xs text-error absolute left-0 -bottom-5">
              {validationRules.closeFactor.validate(formValues.closeFactor)}
            </span>
          </div>
          <div className="w-full relative">
            <span className="block text-primary font-bold text-lg mb-1">Liquidation Incentive</span>
            <input
              onChange={(e) => onLiquidationIncentiveChange(e.target.valueAsNumber)}
              className="w-full px-3 py-2 outline-none rounded-md bg-[#2a324d]"
              value={isNaN(formValues.liquidationIncentive) ? '' : formValues.liquidationIncentive}
              type="number"
              placeholder={`Liquidation incentive rate e.g. ${defaultParams.liquidationIncentive}`}
            />
            <span className="text-xs text-error absolute left-0 -bottom-5">
              {validationRules.liquidationIncentive.validate(formValues.liquidationIncentive)}
            </span>
          </div>
          <div className="w-full">
            <span className="block text-primary font-bold text-lg mb-1">Lease Period</span>
            <Selector
              onChange={(v: any) => onLeasePeriodChange(v)}
              value={formValues.leasePeriod}
              options={oceanLeasePeriodOptions.map((o) => ({
                value: o.seconds,
                label: o.name
              }))}
            />
          </div>
          <Button
            disabled={isNextDisabled()}
            onClick={() => onNext()}
            className="capitalize absolute right-0 -bottom-12 py-1 w-24 text-base">
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default OceanConfigStep;
