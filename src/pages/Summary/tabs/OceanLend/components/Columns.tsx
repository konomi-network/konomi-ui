import { useMemo, useState } from 'react';
import { IOceanCurrencyInfo } from 'types/ocean';
import { Antd, Collapse, TokenIcon } from 'components';
import { displayFloatPrefix } from 'utils/formatter';
import { ArrowRight } from 'resources/icons';
import Actions from './Actions';
import detailSettings from 'pages/Oceans/config';
import styles from 'pages/Oceans/components/Expand.module.scss';

// TODO: refactor with ocean lending page
const ColumnActions = ({
  currency,
  rewards
}: {
  currency: IOceanCurrencyInfo;
  rewards?: Map<string, number>;
}) => {
  const [showDetail, toggleDetail] = useState(false);
  const { interest, underlyingAddress, canBeCollateral, collateralFactor, oTokenAddress } =
    currency;

  return (
    <div className="flex items-center justify-end gap-x-4">
      <Actions oTokenAddress={oTokenAddress} rewards={rewards} />
      <span className="text-gray-400 hover:text-primary cursor-pointer">
        <ArrowRight onClick={() => toggleDetail(true)} fill="currentColor" width={24} />
      </span>
      <Antd.Modal
        className={styles.detailModal}
        visible={showDetail}
        onCancel={() => toggleDetail(false)}
        closable={false}
        width={820}
        footer={null}
        destroyOnClose
        centered>
        <div className="w-full flex gap-x-6">
          <Collapse
            title="Pool Info"
            showCollapse
            options={[
              {
                label: 'Address',
                type: 'text',
                style: 'address',
                value: underlyingAddress
              },
              {
                label: 'Can be collateral',
                type: 'radio',
                field: 'canBeCollateral',
                value: canBeCollateral
              },
              {
                label: 'Collateral factor',
                type: 'text',
                style: 'percentage',
                value: collateralFactor
              }
            ]}
          />
          <Collapse
            title="Interest Rate Model"
            showCollapse
            options={detailSettings.interestRateSettingFields.map((setting: any) => ({
              ...setting,
              value: interest[setting.field as keyof typeof interest]
            }))}
          />
        </div>
      </Antd.Modal>
    </div>
  );
};

const ColumnAsset = ({ symbol, currency }: { symbol: string; currency: IOceanCurrencyInfo }) => {
  const { underlyingPrice } = currency;

  return (
    <TokenIcon
      className="uppercase text-white"
      name={symbol}
      price={underlyingPrice}
      showName
      showPrice
      size={25}
      borderWidth={0}
      style={{
        justifyContent: 'flex-start'
      }}
    />
  );
};

const ColumnRewardBalance = ({
  currency,
  rewards: rewardsMap
}: {
  currency: IOceanCurrencyInfo;
  rewards?: Map<string, number>;
}) => {
  const { underlyingPrice, oTokenAddress } = currency;

  const reward = useMemo(() => {
    if (rewardsMap && oTokenAddress) {
      return rewardsMap.get(oTokenAddress);
    }
    return 0;
  }, [rewardsMap, oTokenAddress]);

  const balanceInUSD = useMemo(() => {
    if (!!underlyingPrice && typeof reward === 'number') {
      return `$${displayFloatPrefix(+underlyingPrice * reward)}`;
    }
    return '--';
  }, [underlyingPrice, reward]);

  return (
    <div className="flex flex-col">
      <span className="font-bold">
        {typeof reward === 'number' ? displayFloatPrefix(reward, 2) : '--'}
      </span>
      <span className="text-xs">{balanceInUSD}</span>
    </div>
  );
};

export { ColumnAsset, ColumnRewardBalance, ColumnActions };
