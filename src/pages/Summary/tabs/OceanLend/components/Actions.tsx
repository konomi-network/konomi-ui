import { useMemo, useState } from 'react';
import cx from 'classnames';
import { Antd, Button } from 'components';
import useOTokenContract from 'hooks/useOTokenContract';
import { HintIcon } from 'resources/icons';
import styles from './Actions.module.scss';

type TActionsProps = {
  oTokenAddress: string;
  rewards?: Map<string, number>;
};

const Actions: React.FC<TActionsProps> = ({ oTokenAddress, rewards: rewardsMap }) => {
  const { oceanMasterWithdrawAll } = useOTokenContract(oTokenAddress);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const reward = useMemo(() => {
    if (rewardsMap && oTokenAddress) {
      return rewardsMap.get(oTokenAddress);
    }
    return 0;
  }, [rewardsMap, oTokenAddress]);

  const handleWithdrawRewards = () => {
    setIsWithdrawing(true);
    oceanMasterWithdrawAll(() => {
      setIsWithdrawing(false);
    });
  };

  return (
    <div className={cx(styles.wrapper, 'flex items-center')}>
      <Button
        onClick={handleWithdrawRewards}
        disabled={!reward}
        isLoading={isWithdrawing}
        className={cx(styles.button, 'text-xs capitalize w-20 px-2 py-1')}>
        Withdraw Rewards
      </Button>
      {!reward && (
        <Antd.Tooltip placement="top" title="No rewards to be withdrawn">
          <HintIcon className="ml-2" width={14} height={14} />
        </Antd.Tooltip>
      )}
    </div>
  );
};

export default Actions;
