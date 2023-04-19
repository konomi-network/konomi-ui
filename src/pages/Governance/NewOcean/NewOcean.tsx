import React, { useCallback, useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import produce from 'immer';
import { InterestConfig, TokenConfig } from '@konomi-network/client/dist/config';
import { Address, Uint16 } from '@konomi-network/client/dist/types';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

import { ConfirmModal, Button, Antd } from 'components';
import { IAccount } from 'pages/Oracle/types';
import { isContractAddress } from 'utils/web3';
import useKonoAllowance from 'hooks/useKonoAllowance';
import {
  getBlockTime,
  getDataSources,
  getLeasePeriodOptions,
  getOceanLeasePeriodOptions,
  getOceanLendingDefaultParams
} from 'modules/common/reducer';
import { RootState } from 'modules/rootReducer';
import { getCurrentNetworkId } from 'modules/connection/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { ICurrency, ICollateral, IInterest } from 'types/oceanProposal';
import useGovernorContract from 'hooks/useGovernorContract';
import { IOracleWithSubscribeState } from 'types/oracle';

import { OceanConfigStep, PoolSetupStep, SelectCurrencyStep } from './steps';
import { ConfirmSection } from './components';
import { steps } from './config';
import styles from './NewOcean.module.scss';

type TProps = {
  selectedAccount: IAccount | null;
  leasePeriodOptions: Array<any>;
  dataSources: any[];
  networkId?: number;
};

const NewOcean: React.FC<TProps> = ({ selectedAccount }) => {
  const { governorContract, payable, getPayable, proposeOcean } = useGovernorContract();
  const { isIncreasing, allowance, onClickIncreaseAllowance } = useKonoAllowance(
    governorContract?.address
  );
  const navigate = useNavigate();
  const blockTime = useSelector(getBlockTime);
  const oceanLeasePeriodOptions = useSelector(getOceanLeasePeriodOptions);
  const defaultParams = useSelector(getOceanLendingDefaultParams);
  const [addedCurrencies, setAddedCurrencies] = useState<ICurrency[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<ICurrency | null>(null);
  const [isConfirmModalVisible, toggleConfirmModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  const [liquidationIncentive, setIncentiveLiq] = useState(
    Number(defaultParams.liquidationIncentive)
  );
  const [closeFactor, setCloseFactor] = useState(Number(defaultParams.closeFactor));
  const [leasePeriod, setLeasePeriod] = useState(oceanLeasePeriodOptions[0].seconds);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddCurrency = (currency: IOracleWithSubscribeState) => {
    const { symbol, subscriptionId } = currency;
    if (!addedCurrencies.find((sc) => sc.symbol === symbol))
      setAddedCurrencies(
        addedCurrencies.concat({
          underlying: '',
          symbol: symbol,
          subscriptionId: subscriptionId,
          collateral: {
            canBeCollateral: false,
            collateralFactor: defaultParams.collateralFactor
          },
          interest: {
            kink: defaultParams.kink,
            baseRatePerYear: defaultParams.baseRatePerYear,
            multiplierPerYear: defaultParams.multiplierPerYear,
            jumpMultiplierPerYear: defaultParams.jumpMultiplierPerYear
          }
        })
      );
  };

  const handleUpdateCurrencyUnderlying = useCallback((value: string) => {
    setSelectedCurrency(
      produce((draft) => {
        if (draft) {
          draft.underlying = value;
        }
      })
    );
  }, []);

  const handleUpdateCollateral = useCallback(
    (value: number | boolean, field: keyof ICollateral) => {
      setSelectedCurrency(
        produce((draft) => {
          if (draft) {
            if (typeof value === 'boolean') {
              (draft.collateral[field] as boolean) = value;
            }

            if (typeof value === 'number') {
              (draft.collateral[field] as number | string) = isNaN(value) ? '' : value;
            }
          }
        })
      );
    },
    []
  );

  const handleUpdateInterest = useCallback((value: number, field: keyof IInterest) => {
    setSelectedCurrency(
      produce((draft) => {
        if (draft) {
          (draft.interest[field] as number | string) = isNaN(value) ? '' : value;
        }
      })
    );
  }, []);

  const getValidateMsg = (): string => {
    if (!selectedAccount) {
      return 'Connect a Wallet to Subscribe';
    }

    const underlyingArr = addedCurrencies.map((c) => c.underlying.toLowerCase());
    for (const address of underlyingArr) {
      if (!address || !isContractAddress(address)) return 'Invalid currency address';

      if (underlyingArr.indexOf(address) !== underlyingArr.lastIndexOf(address)) {
        return 'Same address appears';
      }
    }

    for (const currency of addedCurrencies) {
      const { kink, baseRatePerYear } = currency.interest;
      if (kink && baseRatePerYear && kink <= baseRatePerYear)
        return 'Kink must be greater than base rate';
    }

    return '';
  };

  const onClickConfirm = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    const tokens: TokenConfig[] = addedCurrencies.map(
      ({ underlying, subscriptionId, interest, collateral }) => ({
        underlying: Address.fromString(underlying),
        subscriptionId: new Uint16(subscriptionId),
        interest: new InterestConfig(
          interest.baseRatePerYear ? new Uint16(+interest.baseRatePerYear * 100) : undefined, // baseRatePerYear
          interest.multiplierPerYear ? new Uint16(+interest.multiplierPerYear * 100) : undefined, // multiplierPerYear
          interest.jumpMultiplierPerYear
            ? new Uint16(+interest.jumpMultiplierPerYear * 100)
            : undefined, // jumpMultiplierPerYear
          interest.kink ? new Uint16(+interest.kink * 100) : undefined // kink
        ),
        collateral: {
          canBeCollateral: collateral.canBeCollateral,
          collateralFactor: collateral.collateralFactor
            ? new Uint16(+collateral.collateralFactor * 100)
            : undefined
        }
      })
    );

    const pool = {
      liquidationIncentive: new Uint16(liquidationIncentive * 1000),
      closeFactor: new Uint16(closeFactor * 100),
      tokens
    };

    proposeOcean(
      {
        pool,
        leasePeriod: leasePeriod / blockTime
      },
      (error: any) => {
        setIsSubmitting(false);
        if (error) setErrorMsg(error.message);
      }
    );
  };

  const renderConfirmButton = () => {
    const validateMsg = getValidateMsg();
    if (!!validateMsg) {
      return (
        <Button className="py-2" disabled>
          {validateMsg}
        </Button>
      );
    }

    if (allowance === 0 || allowance < payable) {
      return (
        <Button
          isLoading={isIncreasing}
          className="py-2 capitalize"
          onClick={() => onClickIncreaseAllowance()}>
          Increase Your KONO Allowance
        </Button>
      );
    }

    return (
      <div className="w-full h-9 flex justify-between">
        <Button
          isLoading={isSubmitting}
          className="py-1.5 px-0 w-full"
          onClick={() => onClickConfirm()}>
          Confirm
        </Button>
        <ConfirmModal
          content="Confirm your KONO transaction"
          onSubmit={onClickConfirm}
          isVisible={isConfirmModalVisible}
          toggleVisible={toggleConfirmModal}
        />
      </div>
    );
  };

  const renderStepTitle = ({ value, label }: { value: number; label: string }) => {
    return (
      <div className="w-60 relative">
        <div className="absolute w-6 h-0.5 left-0 top-1.5 bg-primary"></div>
        <div
          className={`absolute left-7 -top-4 font-medium flex flex-col items-start ${
            step === value ? 'text-primary' : 'text-gray-400'
          }`}>
          <span className="text-xl">Step {value}</span>
          <span className="text-xs">{label}</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    if (selectedCurrency) {
      setAddedCurrencies(
        addedCurrencies.map((c) => (c.symbol === selectedCurrency.symbol ? selectedCurrency : c))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCurrency]);

  useEffect(() => {
    getPayable();
  }, [getPayable]);

  return (
    <div className="w-full mb-10">
      <Antd.PageHeader
        className="py-4 px-0"
        onBack={() => navigate('/governance?tab=oceans')}
        backIcon={<ArrowLeftOutlined className="text-primary text-xl" />}
        title={<div className="text-primary font-semibold">New Ocean Proposal</div>}
      />
      <div className="relative flex w-full">
        <div className={styles.verticalDecorator}></div>
        <div className="flex-1">
          <SelectCurrencyStep
            title={renderStepTitle(steps[0])}
            stepValue={steps[0].value}
            currentStep={step}
            addedCurrencies={addedCurrencies}
            onAddCurrency={(c) => handleAddCurrency(c)}
            onRemoveCurrency={(c) =>
              setAddedCurrencies(addedCurrencies.filter((s) => s.symbol !== c.symbol))
            }
            onNext={() => setStep(steps[0].value + 1)}
            onBack={() => setStep(steps[0].value)}
          />
          <OceanConfigStep
            title={renderStepTitle(steps[1])}
            stepValue={steps[1].value}
            currentStep={step}
            formValues={{
              leasePeriod,
              closeFactor,
              liquidationIncentive
            }}
            onCloseFactorChange={(v) => setCloseFactor(v)}
            onLiquidationIncentiveChange={(v) => setIncentiveLiq(v)}
            onLeasePeriodChange={(v) => setLeasePeriod(v)}
            onNext={() => setStep(steps[1].value + 1)}
            onBack={() => setStep(steps[1].value)}
          />
          <PoolSetupStep
            title={renderStepTitle(steps[2])}
            stepValue={steps[2].value}
            currentStep={step}
            addedCurrencies={addedCurrencies}
            selectedCurrency={selectedCurrency}
            handleUpdateCurrencyUnderlying={handleUpdateCurrencyUnderlying}
            handleUpdateCollateral={handleUpdateCollateral}
            handleUpdateInterest={handleUpdateInterest}
            onSelectCurrency={setSelectedCurrency}
          />
        </div>
      </div>
      <ConfirmSection
        price={payable}
        confirmButton={renderConfirmButton()}
        finalStep={steps[steps.length - 1].value}
        currentStep={step}
        errorMsg={errorMsg}
      />
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedAccount: getSelectedAccount(state),
  leasePeriodOptions: getLeasePeriodOptions(state),
  dataSources: getDataSources(state),
  networkId: getCurrentNetworkId(state)
});

export default connect(mapStateToProps)(NewOcean);
