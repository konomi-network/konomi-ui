import cx from 'classnames';
import LeftOutlined from '@ant-design/icons/LeftOutlined';

import { Antd } from 'components';
import { displayFloat, displayFloatPrefix } from 'utils/formatter';
import { IOcean, IOceanCurrencyInfo, IAccount } from 'types/ocean';
import { ColumnActions, ColumnAsset, ColumnRewardBalance } from './Columns';
import styles from 'pages/Oceans/components/Expand.module.scss';

type TProps = IOcean & {};
const SummaryLine: React.FC<IAccount> = ({ accountBorrowUSD, accountSupplyUSD }) => {
  return (
    <div className="my-4 flex justify-start gap-20">
      <div className="flex flex-col text-left text-primary">
        <div className="text-base">Total Borrow</div>
        <span className="text-3xl text-white font-medium">{displayFloat(accountBorrowUSD)}</span>
      </div>

      <div className="flex flex-col text-left text-primary">
        <div className="text-base">Total Supply</div>
        <span className="text-3xl text-white font-medium">{displayFloat(accountSupplyUSD)}</span>
      </div>
    </div>
  );
};

// TODO: refactor with ocean lending page
const Expand: React.FC<TProps> = (props) => {
  const {
    currencies,
    accountBorrowUSD,
    accountSupplyUSD,
    closeFactor,
    liquidationIncentive,
    rewards
  } = props;

  // TODO: use correct data when api is ready
  const columns = [
    {
      title: 'Assets',
      dataIndex: 'underlyingSymbol',
      key: 'underlyingSymbol',
      render: (symbol: string, record: IOceanCurrencyInfo) => (
        <ColumnAsset symbol={symbol} currency={record} />
      )
    },
    {
      title: 'My Reward',
      className: '!text-primary',
      dataIndex: 'underlyingBalance',
      key: 'underlyingBalance',
      render: (text: any, record: IOceanCurrencyInfo) => (
        <ColumnRewardBalance currency={record} rewards={rewards} />
      )
    },
    {
      title: 'Market Supplied',
      dataIndex: 'totalSupply',
      key: 'totalSupply',
      render: (value: number, record: IOceanCurrencyInfo) => (
        <div className="flex flex-col">
          <span>{displayFloatPrefix(value, 2)}</span>
          <span className="text-xs text-gray-400">
            ${displayFloatPrefix(record.totalSupplyUSD, 2)}
          </span>
        </div>
      )
    },
    {
      title: 'Market Borrowed',
      dataIndex: 'totalBorrow',
      key: 'totalBorrow',
      render: (value: number, record: IOceanCurrencyInfo) => (
        <div className="flex flex-col">
          <span>{displayFloatPrefix(value, 2)}</span>
          <span className="text-xs text-gray-400">
            ${displayFloatPrefix(record.totalBorrowUSD, 2)}
          </span>
        </div>
      )
    },
    {
      title: 'Supply APY',
      dataIndex: 'supplyAPY',
      key: 'supplyAPY',
      render: (value: number) => `${displayFloat(value, 2)}%`
    },
    {
      title: 'Borrow APY',
      dataIndex: 'borrowAPY',
      key: 'borrowAPY',
      render: (value: number) => `${displayFloat(value, 2)}%`
    },
    {
      title: '',
      key: 'actions',
      // @ts-ignore
      render: (text: any, record: IOceanCurrencyInfo) => (
        <ColumnActions currency={record} rewards={rewards} />
      )
    }
  ];

  return (
    <div
      className={cx(
        styles.container,
        'm-0 p-10 relative flex-col overflow-hidden w-full bg-transparent text-white rounded-md'
      )}>
      <SummaryLine
        {...{
          accountBorrowUSD,
          accountSupplyUSD
        }}
      />

      <div
        className={cx(styles.table, 'w-full rounded px-9 py-6')}
        style={{ backgroundColor: '#251B38' }}>
        <div className="font-bold text-lg text-primary text-left mb-1 w-full">
          My Ocean Lend Pools
        </div>
        <Antd.Table
          rowKey={(record) => record.oTokenAddress}
          pagination={false}
          dataSource={currencies}
          columns={columns}
        />
      </div>
      <div className="mt-8 text-left w-full px-4 flex items-end">
        <div className="flex items-center mr-8 text-gray-400">
          <span className="font-bold text-base mr-4">Ocean Config</span>
          <LeftOutlined style={{ color: 'currentcolor', fontSize: 20 }} />
        </div>
        <div className="mr-8">
          <span className="text-gray-500 mr-2">Close Factor: </span>
          <span>{closeFactor} %</span>
        </div>
        <div>
          <span className="text-gray-500 mr-2">Liquidation Incentive :</span>
          <span>{liquidationIncentive}</span>
        </div>
      </div>
    </div>
  );
};

export default Expand;
