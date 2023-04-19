import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import cx from 'classnames';
import { IOcean, IOceanCurrencyInfo } from 'types/ocean';
import { Antd, Button, TokenIcon } from 'components';
import { displayFloat, toFixedDown } from 'utils/formatter';
import { areEqualAddresses, convertToEtherValue, convertToHex, getNegativeOne } from 'utils/web3';
import { getLocalStorage, LOCAL_STORAGE_KEYS, setLocalStorage } from 'utils/storage';
import { getSelectedAccount } from 'modules/account/reducer';
import { getOceanMaxSupply } from 'modules/common/reducer';
import useActiveWeb3React from 'hooks/useActiveWeb3React';
import useErc20Allowance from 'hooks/useErc20Allowance';
import useOTokenContract, { OTokenMethods } from 'hooks/useOTokenContract';
import useOceanFetch from 'hooks/useOceanFetch';
import useIsMounted from 'hooks/useIsMounted';
import useComptrollerContract from 'hooks/useComptrollerContract';
import styles from './Actions.module.scss';

type TTab = {
  label: string;
  value: string;
};

type TModalProps = IOceanCurrencyInfo & {
  isVisible: boolean;
  symbol: string;
  apy: number;
  amount: number;
  tabs: TTab[];
  totalLiquidity: number;
  accountBorrowUSD: number;
  accountBorrowLimit: number;
  onCancel: () => void;
  onReloadPool: () => any;
};

const SUPPLY_WITHDRAW_TABS = [
  { label: 'Supply', value: 'supply' },
  { label: 'Withdraw', value: 'withdraw' }
];

const BORROW_REPAY_TABS = [
  { label: 'Borrow', value: 'borrow' },
  { label: 'Repay', value: 'repay' }
];

const TradeModal: React.FC<TModalProps> = ({
  symbol,
  tabs,
  isVisible,
  apy,
  amount,
  accountSupplyAmount,
  accountBorrowAmount,
  oTokenAddress,
  underlyingAddress,
  underlyingPrice,
  totalLiquidity,
  accountBorrowUSD,
  accountBorrowLimit,
  onReloadPool,
  onCancel
}) => {
  const isMounted = useIsMounted();
  const oToken = useOTokenContract(oTokenAddress);
  const { library } = useActiveWeb3React();
  const { isIncreasing, erc20Contract, allowance, onClickApprove } = useErc20Allowance(
    oTokenAddress,
    underlyingAddress
  );
  const oceanMaxSupply = useSelector(getOceanMaxSupply);
  const selectedAccount = useSelector(getSelectedAccount);
  const [value, setValue] = useState('0');
  const [maxValue, setMax] = useState(0);
  const [balance, setBalance] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [type, setType] = useState(tabs[0].value);
  const isRepayAll = type === 'repay' && !!value && value === toFixedDown(maxValue + '', 3);
  const tokenAmountToPrice = Number(value) * underlyingPrice;
  const isExceedCollateral = accountBorrowUSD + tokenAmountToPrice > accountBorrowLimit;

  const isSupplyingDisabled = useMemo(() => {
    if (!oceanMaxSupply) return false;
    if (totalLiquidity >= oceanMaxSupply) return true;
    if (totalLiquidity + tokenAmountToPrice > oceanMaxSupply) return true;
    return false;
  }, [oceanMaxSupply, tokenAmountToPrice, totalLiquidity]);

  const isIncreaseAllowance = useMemo(
    () => ['supply', 'repay'].includes(type) && (!allowance || allowance < +value),
    [allowance, type, value]
  );

  const renderButtonText = useMemo((): string => {
    if (isIncreaseAllowance) {
      return 'Approve allowance';
    }
    return type;
  }, [isIncreaseAllowance, type]);

  const isSubmitDisabled = useMemo(() => {
    if (type === 'supply' && isSupplyingDisabled) {
      return true;
    }

    if (type === 'borrow') {
      if (isExceedCollateral || +value === 0) {
        return true;
      }
      return false;
    }

    if (+value === 0 || +value > maxValue) return true;

    return false;
  }, [isExceedCollateral, maxValue, type, value, isSupplyingDisabled]);

  const handleBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (+inputValue > maxValue && type !== 'borrow') {
      setValue(toFixedDown(maxValue + '', 3));
      return;
    }
    setValue(+inputValue <= 0 ? '0' : toFixedDown(inputValue, 3));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(+inputValue < 0 ? '0' : inputValue);
  };

  const handleSubmit = () => {
    if (isIncreaseAllowance) {
      onClickApprove(+value);
      return;
    }

    if (value && library && selectedAccount) {
      setIsSubmitting(true);
      const hexValue = isRepayAll ? getNegativeOne() : convertToHex(value);
      oToken[type as OTokenMethods](hexValue, () => {
        onReloadPool();
        if (isMounted()) setIsSubmitting(false);
      })?.catch((err) => {
        if (isMounted() && err) setIsSubmitting(false);
      });
    }
  };

  useEffect(() => {
    setValue('0');
    if (type === 'supply') {
      setMax(balance);
    }

    if (type === 'withdraw' || type === 'repay') {
      setMax(amount);
    }
  }, [type, balance, amount]);

  useEffect(() => {
    if (selectedAccount && erc20Contract) {
      erc20Contract.balanceOf(selectedAccount.address).then((result) => {
        setBalance(+convertToEtherValue(result));
      });
    }
  }, [erc20Contract, selectedAccount, accountSupplyAmount, accountBorrowAmount]);

  return (
    <Antd.Modal
      onCancel={onCancel}
      className={styles.modal}
      width={400}
      visible={isVisible}
      footer={null}
      destroyOnClose
      centered>
      <TokenIcon
        showName
        size={42}
        name={symbol}
        borderWidth={1}
        className="uppercase text-3xl font-bold mb-5 font-rubik"
      />
      <div className={cx('relative flex justify-center items-center mb-6', styles.inputWrapper)}>
        <input
          autoFocus
          type="number"
          onBlur={handleBlur}
          onChange={handleInputChange}
          value={value}
          className={cx(
            styles.input,
            'text-center border-none outline-none bg-transparent text-primary font-bold w-full'
          )}
        />
        {type !== 'borrow' && (
          <Button
            onClick={() => setValue(toFixedDown(maxValue + '', 3))}
            className="absolute right-0 bottom-0 border-0 px-4 py-1">
            MAX
          </Button>
        )}
      </div>
      <div className="mb-4 text-xs">
        {isSupplyingDisabled && type === 'supply' ? (
          <>Ocean Max Size Cap: {oceanMaxSupply} USD Exceeded</>
        ) : (
          <>Available in Wallet: {balance}</>
        )}
      </div>
      <Antd.Tabs
        centered
        size="large"
        className={styles.tabs}
        activeKey={type}
        onChange={(tab) => setType(tab)}
        destroyInactiveTabPane>
        {tabs.map((item) => {
          return <Antd.Tabs.TabPane tab={item.label} key={item.value} />;
        })}
      </Antd.Tabs>
      <div className="font-rubik text-base text-white">
        <div className="flex justify-between items-center font-light mb-5">
          <span className="flex justify-between items-center capitalize">
            <TokenIcon
              withBackground={false}
              borderWidth={1}
              size={24}
              name={symbol}
              className="mr-4"
            />
            {tabs[0].value} APY
          </span>
          <span>~{displayFloat(apy)} %</span>
        </div>
        <div className="flex justify-between items-center font-light mb-5">
          <span>Your {tabs[0].value}</span>
          <span>
            {displayFloat(amount, 3)} {symbol.toUpperCase()}
          </span>
        </div>
      </div>
      <Button
        isLoading={isSubmitting || isIncreasing}
        disabled={isSubmitDisabled}
        onClick={handleSubmit}
        className={cx(styles.button, 'capitalize w-full text-lg font-bold h-10 rounded-lg')}>
        {renderButtonText}
      </Button>
    </Antd.Modal>
  );
};

type TActionsProps = {
  ocean: IOcean;
  currencyInfo: IOceanCurrencyInfo;
};

const Actions: React.FC<TActionsProps> = (props) => {
  const { ocean, currencyInfo } = props;
  const { supplyAPY, accountSupplyAmount, accountBorrowAmount, borrowAPY, underlyingSymbol } =
    currencyInfo;
  const [showBorrow, toggleBorrow] = useState(false);
  const [showSupply, toggleSupply] = useState(false);
  const [showEnterMarkets, toggleEnterMarkets] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const { fetchOceanCurrencyInfo } = useOceanFetch();
  const { checkMembership, enterMarkets } = useComptrollerContract(ocean.contractAddress);

  const handleToggleBorrow = async () => {
    // checking from cache localStorage
    const enteredMarketsString = getLocalStorage(LOCAL_STORAGE_KEYS.ENTERED_MARKETS);
    if (enteredMarketsString) {
      const enteredMarkets = enteredMarketsString.split(',');
      if (enteredMarkets.find((m) => areEqualAddresses(m, currencyInfo.oTokenAddress))) {
        return toggleBorrow(true);
      }
    }
    // end checking

    const isCollateral = await checkMembership(currencyInfo.oTokenAddress);

    if (isCollateral) {
      toggleBorrow(true);
    } else {
      toggleEnterMarkets(true);
    }
  };

  const handleEnterMarkets = () => {
    setIsEntering(true);
    const oTokenAddresses = ocean.currencies.map((c) => c.oTokenAddress);
    enterMarkets(oTokenAddresses, (error: any) => {
      if (!error) {
        setLocalStorage(LOCAL_STORAGE_KEYS.ENTERED_MARKETS, oTokenAddresses.join(','));
        setIsEntering(false);
        toggleEnterMarkets(false);
        toggleBorrow(true);
      }
    });
  };

  return (
    <div className={cx(styles.wrapper, 'flex gap-x-4')}>
      <Button
        onClick={() => toggleSupply(true)}
        className={cx(styles.button, 'text-xs capitalize w-20 py-1')}>
        Supply
      </Button>
      <Button
        onClick={handleToggleBorrow}
        className={cx(styles.button, 'text-xs capitalize w-20 py-1')}>
        Borrow
      </Button>
      <Antd.Modal
        className={styles.modal}
        visible={showEnterMarkets}
        onCancel={() => toggleEnterMarkets(false)}
        closable={false}
        width={420}
        footer={null}
        destroyOnClose
        centered>
        <h2 className="text-gray-400 text-left mb-4">
          The ocean master has selected the following as collateral:
        </h2>
        <div className="flex justify-center gap-x-2 mb-4">
          {ocean.currencies.map((c) => (
            <TokenIcon
              key={c.underlyingSymbol}
              name={c.underlyingSymbol.toLowerCase()}
              borderWidth={2}
            />
          ))}
        </div>
        <p className="text-gray-400 text-left mb-4">
          To participate in this pool, the supplies to this ocean will enable the above tokens as
          collateral.
        </p>
        <Button
          isLoading={isEntering}
          onClick={handleEnterMarkets}
          className={cx(styles.button, 'capitalize w-full text-lg font-bold h-10 rounded-lg')}>
          Confirm
        </Button>
      </Antd.Modal>
      <TradeModal
        isVisible={showSupply}
        apy={supplyAPY}
        amount={accountSupplyAmount / 1e8}
        symbol={underlyingSymbol}
        tabs={SUPPLY_WITHDRAW_TABS}
        onCancel={() => toggleSupply(false)}
        onReloadPool={() => fetchOceanCurrencyInfo(ocean, currencyInfo)}
        totalLiquidity={ocean.totalLiquidity}
        accountBorrowUSD={ocean.accountBorrowUSD}
        accountBorrowLimit={ocean.accountBorrowLimit}
        {...currencyInfo}
      />
      <TradeModal
        isVisible={showBorrow}
        apy={borrowAPY}
        amount={accountBorrowAmount / 1e18}
        symbol={underlyingSymbol}
        tabs={BORROW_REPAY_TABS}
        onCancel={() => toggleBorrow(false)}
        onReloadPool={() => fetchOceanCurrencyInfo(ocean, currencyInfo)}
        totalLiquidity={ocean.totalLiquidity}
        accountBorrowUSD={ocean.accountBorrowUSD}
        accountBorrowLimit={ocean.accountBorrowLimit}
        {...currencyInfo}
      />
    </div>
  );
};

export default Actions;
