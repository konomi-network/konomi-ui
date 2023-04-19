import { useEffect, useMemo, useState } from 'react';

import { IOcean, IOceanCurrencyInfo } from 'types/ocean';
import { Antd, Collapse, TokenIcon } from 'components';
import { displayFloatPrefix } from 'utils/formatter';
import useErc20Contract from 'hooks/useErc20Contract';
import detailSettings from 'pages/Oceans/config';
import { ArrowRight } from 'resources/icons';
import Actions from './Actions';
import styles from './Expand.module.scss';

const ColumnActions = ({ currency, ocean }: { currency: IOceanCurrencyInfo; ocean: IOcean }) => {
  const [showDetail, toggleDetail] = useState(false);
  const { interest, underlyingAddress, canBeCollateral, collateralFactor } = currency;

  return (
    <div className="flex items-center justify-end gap-x-4">
      <Actions ocean={ocean} currencyInfo={currency} />

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

const ColumnWalletBalance = ({ currency }: { currency: IOceanCurrencyInfo }) => {
  const { accountBorrowAmount, accountSupplyAmount, underlyingPrice } = currency;
  const { isBalanceFetching, balance, getBalance } = useErc20Contract(currency.underlyingAddress);

  const balanceInUSD = useMemo(() => {
    if (!!underlyingPrice && !isBalanceFetching) {
      return `$${displayFloatPrefix(+underlyingPrice * balance)}`;
    }
    return '--';
  }, [balance, isBalanceFetching, underlyingPrice]);

  useEffect(() => {
    getBalance();
  }, [accountSupplyAmount, accountBorrowAmount, getBalance]);

  return (
    <div className="flex flex-col">
      <span>{isBalanceFetching ? '--' : displayFloatPrefix(balance, 2)}</span>
      <span className="text-xs text-gray-400 ">{balanceInUSD}</span>
    </div>
  );
};

export { ColumnAsset, ColumnWalletBalance, ColumnActions };
