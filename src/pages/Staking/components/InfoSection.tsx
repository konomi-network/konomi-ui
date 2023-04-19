import { useSelector } from 'react-redux';
import cx from 'classnames';
import { Antd, Button } from 'components';
import { PLATFORM } from 'config/settings';
import useStakingContract from 'hooks/useStakingContract';
import useKonoAllowance from 'hooks/useKonoAllowance';
import useConnectionState from 'hooks/useConnectionState';
import { getCurrentStakingAddress } from 'modules/connection/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { HintIcon } from 'resources/icons';
import { displayFloat } from 'utils/formatter';
import styles from '../Staking.module.scss';
import { ReactComponent as KonoLogoIcon } from '../images/konoLogo.svg';

type TProps = {
  tab: string | null;
  exceedMaxDeposit: boolean;
  isEnded: boolean;
  stakingType: string;
  depositAmount: string;
  withdrawAmount: string;
  totalAsset: string;
  minDeposit: number;
  maxDeposit: number;
  currentTotalDeposit: number;
  rewardInPool: number;
  userReward: number;
  userDeposit: number;
  balance: number;
  apr: number;
  setDepositAmount?: (input: string) => void;
  setWithdrawAmount: (input: string) => void;
  handleReload: () => void;
};
const InfoSection: React.FC<TProps> = ({
  tab,
  apr,
  isEnded,
  stakingType,
  depositAmount,
  withdrawAmount,
  rewardInPool,
  minDeposit,
  maxDeposit,
  currentTotalDeposit,
  userReward,
  userDeposit,
  balance,
  exceedMaxDeposit,
  totalAsset,
  setWithdrawAmount,
  handleReload
}) => {
  const stakingAddress = useSelector(getCurrentStakingAddress);
  const selectedAccount = useSelector(getSelectedAccount);
  const { toggleWalletConnect } = useConnectionState();
  const { allowance, onClickIncreaseAllowance, isIncreasing } = useKonoAllowance(stakingAddress);
  const { deposit, withdraw, withdrawAll, isSubmitting } = useStakingContract();
  const isDepositFull = currentTotalDeposit === maxDeposit;

  const handleWithdraw = () => {
    const callbackOnDone = () => {
      setWithdrawAmount('0');
      handleReload();
    };

    if ((+withdrawAmount >= +totalAsset && +totalAsset > 0) || isEnded) {
      return withdrawAll(callbackOnDone);
    }
    return withdraw(withdrawAmount, callbackOnDone);
  };

  const renderButton = () => {
    const isWithdrawDisabled =
      +withdrawAmount <= 0 ||
      withdrawAmount > totalAsset ||
      (stakingType === 'WithdrawWhenEnd' && !isEnded);

    const isDepositDisabled =
      isDepositFull ||
      exceedMaxDeposit ||
      +depositAmount < minDeposit ||
      +depositAmount > balance ||
      isEnded;

    if (!selectedAccount) {
      return (
        <Button
          className="pointer-events-auto"
          onClick={(e: React.MouseEvent<HTMLElement>) => toggleWalletConnect(e)}>
          Connect wallet
        </Button>
      );
    }

    if (tab === 'withdraw') {
      return (
        <Button
          isLoading={isSubmitting}
          className={cx({
            [styles.disabled]: isWithdrawDisabled
          })}
          onClick={() => handleWithdraw()}>
          {isEnded ? 'withdraw all' : 'withdraw'}
        </Button>
      );
    }

    if (allowance < +depositAmount) {
      return (
        <Button
          isLoading={isIncreasing}
          className={cx({
            [styles.disabled]: isDepositDisabled
          })}
          onClick={() => onClickIncreaseAllowance(maxDeposit)}>
          increase allowance
        </Button>
      );
    }

    return (
      <Button
        isLoading={isSubmitting}
        className={cx({
          [styles.disabled]: isDepositDisabled
        })}
        onClick={() => deposit(depositAmount, handleReload)}>
        deposit
      </Button>
    );
  };

  return (
    <div className={'relative flex flex-col px-9'}>
      <div className={!selectedAccount ? 'opacity-50' : 'relative'}>
        <div className="flex justify-between items-center font-light mb-5">
          <span className="flex justify-between items-center">
            <KonoLogoIcon width={33} height={33} className="mr-4" /> Staking APR
          </span>
          <span>~{displayFloat(apr * 100)} %</span>
        </div>
        <div className="flex justify-between items-center font-light mb-5">
          <span className="flex items-center">
            Reward In Pool
            <Antd.Tooltip placement="top" title={'Reward amount still existing in staking pool'}>
              <HintIcon className="ml-2" />
            </Antd.Tooltip>
          </span>
          <span>
            {displayFloat(rewardInPool, 2)} {PLATFORM.tokenName}
          </span>
        </div>
        <div className="flex justify-between items-center font-light mb-5">
          <span>Your Deposit</span>
          <span>
            {displayFloat(userDeposit, 2)} {PLATFORM.tokenName}
          </span>
        </div>
        <div className="flex justify-between items-center font-light mb-5">
          <span>Your Reward</span>
          <span>
            {displayFloat(userReward, 2)} {PLATFORM.tokenName}
          </span>
        </div>
      </div>
      {renderButton()}
    </div>
  );
};

export default InfoSection;
