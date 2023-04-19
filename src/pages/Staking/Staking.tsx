import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import FadeIn from 'react-fade-in';
import cx from 'classnames';
import { startCase } from 'lodash';
import ReloadOutlined from '@ant-design/icons/ReloadOutlined';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { NewSelector } from 'components';
import useKonoBalance from 'hooks/useKonoBalance';
import useStakingContract from 'hooks/useStakingContract';
import useBlockTime from 'hooks/useBlockTime';
import { toFixedDown } from 'utils/formatter';
import { LogoSection, AmountInput, NavigateSection, InfoSection } from './components';
import { getSelectedAccount } from 'modules/account/reducer';
import useChangePhase from './useChangePhase';
import styles from './Staking.module.scss';
import useInterval from 'hooks/useInterval';

const Staking: React.FC = () => {
  const { balance, getBalance } = useKonoBalance();
  const [searchParams] = useSearchParams();
  const selectedAccount = useSelector(getSelectedAccount);
  const { reloadTime } = useBlockTime();

  const {
    selectedStakingType,
    stakingTypes,
    stakingPhases,
    currentStakingAddress,
    handleSelectStakingType,
    handleSelectPhase
  } = useChangePhase();

  const {
    apr,
    isEnded,
    stakingEndTimeString,
    isCheckingEnd,
    minDeposit,
    maxDeposit,
    currentTotalDeposit,
    rewardInPool,
    userDeposit,
    userReward,
    checkEndTime,
    getRewardInPool,
    getMinDeposit,
    getCurrentTotalDeposit,
    getMaxDeposit,
    getStakingInfo,
    getApr
  } = useStakingContract();
  const [isReloading, setIsReloading] = useState(false);
  const [depositAmount, setDepositAmount] = useState('0');
  const [withdrawAmount, setWithdrawAmount] = useState('0');
  const totalAsset = toFixedDown(userDeposit + userReward + '');
  const showReloadBtn = !!selectedAccount && !isCheckingEnd && !isEnded;
  const tab = new URLSearchParams(searchParams).get('tab');

  const exceedMaxDeposit = useMemo(
    () => +depositAmount + userDeposit > maxDeposit,
    [depositAmount, userDeposit, maxDeposit]
  );

  const handleReload = useCallback(() => {
    setIsReloading(true);
    getApr();
    checkEndTime();
    getMaxDeposit();
    getMinDeposit();
    getBalance();
    getRewardInPool();
    getCurrentTotalDeposit();
    getStakingInfo(() => setTimeout(() => setIsReloading(false), 1000));
  }, [
    checkEndTime,
    getBalance,
    getMinDeposit,
    getMaxDeposit,
    getCurrentTotalDeposit,
    getRewardInPool,
    getStakingInfo,
    getApr
  ]);

  const renderReload = () => {
    if (showReloadBtn) {
      if (isReloading)
        return (
          <LoadingOutlined
            style={{ color: '#FF007A', fontSize: 20 }}
            className="absolute top-10 right-8 z-10"
          />
        );

      return (
        <ReloadOutlined
          onClick={() => handleReload()}
          style={{ color: '#FF007A', fontSize: 20 }}
          className="absolute top-10 right-8 cursor-pointer z-10"
        />
      );
    }
  };

  useInterval(handleReload, reloadTime);

  useEffect(() => {
    setWithdrawAmount('0');
  }, [currentStakingAddress]);

  useEffect(() => {
    checkEndTime();
    getBalance();
    getMinDeposit((v) => setDepositAmount(v + ''));
    getStakingInfo();
    getRewardInPool();
    getMaxDeposit();
    getCurrentTotalDeposit();
    getApr();
  }, [
    checkEndTime,
    getBalance,
    getMinDeposit,
    getRewardInPool,
    getStakingInfo,
    getMaxDeposit,
    getCurrentTotalDeposit,
    getApr
  ]);

  const renderContractLoading = () => {
    if (isCheckingEnd && !isReloading) {
      return (
        <div className="absolute inset-0 z-30 bg-zinc-800 opacity-90">
          <LoadingOutlined
            style={{ color: '#FF007A', fontSize: 40 }}
            className="relative top-1/3 text-center"
          />
        </div>
      );
    }
  };

  const renderContent = () => {
    return (
      <FadeIn>
        {!!stakingEndTimeString && (
          <p className="absolute px-2 py-1 top-4 left-4 bg-primary text-white font-bold rounded-md">
            {stakingEndTimeString} left
          </p>
        )}
        <LogoSection />
        <AmountInput
          totalAsset={totalAsset}
          stakingType={selectedStakingType}
          tab={tab}
          balance={balance}
          exceedMaxDeposit={exceedMaxDeposit}
          setDepositAmount={setDepositAmount}
          setWithdrawAmount={setWithdrawAmount}
          depositAmount={depositAmount}
          withdrawAmount={withdrawAmount}
          userDeposit={userDeposit}
          userReward={userReward}
          minDeposit={minDeposit}
          maxDeposit={maxDeposit}
          currentTotalDeposit={currentTotalDeposit}
          isEnded={isEnded}
        />
        <NavigateSection />
        <InfoSection
          totalAsset={totalAsset}
          stakingType={selectedStakingType}
          tab={tab}
          apr={apr}
          isEnded={isEnded}
          exceedMaxDeposit={exceedMaxDeposit}
          minDeposit={minDeposit}
          maxDeposit={maxDeposit}
          currentTotalDeposit={currentTotalDeposit}
          rewardInPool={rewardInPool}
          depositAmount={depositAmount}
          withdrawAmount={withdrawAmount}
          userDeposit={userDeposit}
          userReward={userReward}
          balance={balance}
          setWithdrawAmount={setWithdrawAmount}
          handleReload={handleReload}
        />
      </FadeIn>
    );
  };

  return (
    <FadeIn>
      <div className={styles.wrapper}>
        <div className="flex items-center justify-between gap-4">
          <NewSelector
            className="w-1/2"
            placeholder="Select staking type"
            onChange={(v) => handleSelectStakingType(v as string)}
            disabled={!stakingTypes.length}
            options={stakingTypes.map((p) => ({
              label: startCase(p),
              value: p
            }))}
          />
          <NewSelector
            className="w-1/2"
            placeholder="Select staking batch"
            onChange={(v) => handleSelectPhase(v as string)}
            disabled={!stakingPhases.length}
            value={stakingPhases.length ? currentStakingAddress : undefined}
            options={stakingPhases.map((p, index) => ({
              label: p.startDate + (index === 0 ? '(latest)' : ''),
              value: p.address
            }))}
          />
        </div>
        <div
          className={cx(
            styles.main,
            `relative rounded-2xl mt-4 overflow-hidden ${!selectedAccount && 'pointer-events-none'}`
          )}>
          {renderContractLoading()}
          {renderReload()}
          {renderContent()}
        </div>
      </div>
    </FadeIn>
  );
};

export default Staking;
