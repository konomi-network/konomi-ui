import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import LeftOutlined from '@ant-design/icons/LeftOutlined';

import { Antd } from 'components';
import { getBlockTime } from 'modules/common/reducer';
import { getTimeFromBlock } from 'utils/web3';
import { displayFloat, displayFloatPrefix } from 'utils/formatter';
import { IOcean, IOceanCurrencyInfo } from 'types/ocean';
import useCurrentBlockNumber from 'hooks/useCurrentBlockNumber';
import { ColumnActions, ColumnAsset, ColumnWalletBalance } from './Columns';
import styles from './Expand.module.scss';

type TProps = IOcean & {};

const Expand: React.FC<TProps> = (props) => {
  const {
    currencies,
    accountBorrowLimit,
    accountBorrowUSD,
    accountSupplyUSD,
    leaseEnd,
    closeFactor,
    liquidationIncentive
  } = props;
  const { currentBlock, isCurrentBlockFetching } = useCurrentBlockNumber();
  const blockTime = useSelector(getBlockTime);

  const endTimeString = useMemo(() => {
    if (isCurrentBlockFetching) return '--';
    return getTimeFromBlock(leaseEnd - currentBlock, blockTime) + ' left';
  }, [blockTime, currentBlock, isCurrentBlockFetching, leaseEnd]);

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
      title: 'My Wallet',
      dataIndex: 'underlyingBalance',
      key: 'underlyingBalance',
      render: (text: any, record: IOceanCurrencyInfo) => <ColumnWalletBalance currency={record} />
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
        <ColumnActions ocean={props} currency={record} />
      )
    }
  ];

  return (
    <div
      className={cx(
        styles.container,
        'm-0 p-10 relative flex-col overflow-hidden w-full bg-transparent text-white rounded-md'
      )}>
      {endTimeString && (
        <div
          className="absolute left-0 top-0 px-4 py-2 rounded-br-md bg-primary font-bold"
          style={{ minWidth: 132 }}>
          {endTimeString}
        </div>
      )}
      <div className="mt-6 mb-4 flex justify-start">
        <div className="flex flex-col text-left text-primary mr-8">
          My Borrow Balance
          <span className="text-3xl text-white font-medium">{displayFloat(accountBorrowUSD)}</span>
        </div>
        <div className="flex flex-col text-left text-primary mr-8">
          My Borrow Limit
          <span className="text-3xl text-white font-medium">
            {displayFloat(accountBorrowLimit)}
          </span>
        </div>
        <div className="flex flex-col text-left text-primary mr-8">
          My Supply Balance
          <span className="text-3xl text-white font-medium">{displayFloat(accountSupplyUSD)}</span>
        </div>
      </div>
      <div
        className={cx(styles.table, 'w-full rounded px-9 py-6')}
        style={{ backgroundColor: '#251B38' }}>
        <div className="font-bold text-lg text-primary text-left mb-1 w-full">Pools</div>
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
