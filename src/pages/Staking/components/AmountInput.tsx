import { useSelector } from 'react-redux';
import { Antd } from 'components';
import { getSelectedAccount } from 'modules/account/reducer';
import { displayFloat, toFixedDown } from 'utils/formatter';
import { HintIcon } from 'resources/icons';
import { PLATFORM } from 'config/settings';
import { useEffect, useState } from 'react';
import min from 'lodash/min';
import useInterval from 'hooks/useInterval';

type TProps = {
  tab: string | null;
  isEnded: boolean;
  exceedMaxDeposit: boolean;
  stakingType: string;
  balance: number;
  depositAmount: string;
  withdrawAmount: string;
  totalAsset: string;
  minDeposit: number;
  maxDeposit: number;
  currentTotalDeposit: number;
  userReward: number;
  userDeposit: number;
  setDepositAmount: (input: string) => void;
  setWithdrawAmount: (input: string) => void;
};
const AmountInput: React.FC<TProps> = ({
  tab,
  stakingType,
  depositAmount,
  withdrawAmount,
  userDeposit,
  userReward,
  isEnded,
  balance,
  minDeposit,
  maxDeposit,
  currentTotalDeposit,
  exceedMaxDeposit,
  totalAsset,
  setDepositAmount,
  setWithdrawAmount
}) => {
  const selectedAccount = useSelector(getSelectedAccount);
  const [infoIndex, setInfoIndex] = useState(0);
  const amount = tab === 'withdraw' ? withdrawAmount : depositAmount;
  const isDepositFull = !!maxDeposit && currentTotalDeposit === maxDeposit;
  const isDepositDisabled = tab !== 'withdraw' && (isEnded || isDepositFull);

  useInterval(() => {
    if (!isEnded || isDepositFull) {
      setInfoIndex((prevIndex) => (prevIndex > 0 ? 0 : 1));
    }
  }, 5000);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const validatedValue = +inputValue <= 0 ? '0' : toFixedDown(inputValue);

    if (tab === 'withdraw') {
      return setWithdrawAmount(validatedValue);
    }
    setDepositAmount(validatedValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const validatedValue = +inputValue < 0 ? '0' : inputValue;
    if (tab === 'withdraw') {
      return setWithdrawAmount(validatedValue);
    }
    setDepositAmount(validatedValue);
  };

  const handleMaxInput = () => {
    if (tab === 'withdraw') {
      return setWithdrawAmount(toFixedDown(userDeposit + userReward + ''));
    }
    const amountToDeposit = min([balance, maxDeposit - currentTotalDeposit]) || '';
    setDepositAmount(toFixedDown(amountToDeposit + ''));
  };

  const renderOverlay = () => {
    if (tab !== 'withdraw') {
      const endedTxt = isEnded && 'Staking ended';
      const depositFullTxt = isDepositFull && 'Staking pool is full';
      const errorTxt = endedTxt || depositFullTxt;

      if (!!errorTxt)
        return (
          <div className="absolute inset-0 z-10">
            <div className="absolute top-1/5 flex justify-center items-center w-full text-lg font-bold h-12 text-white bg-error py-1">
              {errorTxt}
            </div>
          </div>
        );
    }
    return null;
  };

  const renderCurrentTotalDeposit = () => {
    const infoList = [
      {
        text: `Total Deposit: ${displayFloat(currentTotalDeposit)}/${displayFloat(maxDeposit)}`,
        tooltip: 'Current total KONO deposited in pool compare to max amount allowed'
      },
      {
        text: `Balance Available: ${displayFloat(balance)}`,
        tooltip: 'Available balance in Wallet'
      }
    ];
    return (
      <>
        {infoList[infoIndex].text}
        <Antd.Tooltip placement="top" title={infoList[infoIndex].tooltip}>
          <HintIcon className="ml-2" width={14} height={14} />
        </Antd.Tooltip>
      </>
    );
  };

  const renderErrorText = () => {
    if (!selectedAccount) {
      return '';
    }

    if (tab === 'withdraw' && +withdrawAmount > +totalAsset) {
      return 'Not enough to withdraw';
    }

    if (tab !== 'withdraw' && exceedMaxDeposit) {
      return 'Your amount will exceed max deposit';
    }

    if (tab !== 'withdraw' && +amount < minDeposit) {
      return `Please deposit at least ${minDeposit} ${PLATFORM.tokenName}`;
    }

    return null;
  };

  const disableInput = () => {
    if (isEnded) return true;
    if (tab !== 'withdraw' && isDepositFull) return true;
    if (tab === 'withdraw') {
      if (userDeposit + userReward === 0) return true;
      if (stakingType === 'WithdrawWhenEnd') return true;
    }
    return false;
  };

  useEffect(() => {
    if (isEnded && +totalAsset > 0) {
      setWithdrawAmount(totalAsset);
    }
  }, [isEnded, setWithdrawAmount, totalAsset]);

  return (
    <div className="relative">
      <div className="relative px-6">
        <div className="mb-4 h-[60px]">
          <input
            autoFocus={!!selectedAccount && !isDepositDisabled}
            type="number"
            min="0"
            disabled={disableInput()}
            value={amount}
            onBlur={handleBlur}
            onChange={handleInputChange}
            className="text-[42px] leading-10 max-w-full text-center border-none outline-none bg-transparent text-primary font-bold disabled:text-gray-500"
          />
          <div
            className="text-primary uppercase absolute right-8 top-5 cursor-pointer hover:underline"
            onClick={handleMaxInput}>
            Max
          </div>
        </div>
        <span className="relative text-primary h-4 flex items-center justify-center z-20 font-rubik">
          {renderCurrentTotalDeposit()}
        </span>
        <span className="text-error h-4 block text-center font-bold mt-2 mb-1">
          {renderErrorText()}
        </span>
        {renderOverlay()}
      </div>
    </div>
  );
};

export default AmountInput;
