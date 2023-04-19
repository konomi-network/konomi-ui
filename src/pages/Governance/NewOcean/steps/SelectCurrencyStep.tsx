import cx from 'classnames';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MinusCircleFilled from '@ant-design/icons/MinusCircleFilled';
import PlusCircleFilled from '@ant-design/icons/PlusCircleFilled';
import { Button, TokenIcon } from 'components';
import { getOraclesByNetwork } from 'modules/oracles/reducer';
import { ICurrency } from 'types/oceanProposal';

import { Table } from '../components';
import { IOracleWithSubscribeState } from 'types/oracle';

type TProps = {
  title: React.ReactNode;
  stepValue: number;
  currentStep: number;
  addedCurrencies: ICurrency[];

  onAddCurrency: (c: IOracleWithSubscribeState) => void;
  onRemoveCurrency: (c: ICurrency) => void;

  onNext: () => void;
  onBack: () => void;
};

const SelectCurrencyStep: React.FC<TProps> = ({
  title,
  currentStep,
  stepValue,
  addedCurrencies,
  onRemoveCurrency,
  onAddCurrency,
  onBack,
  onNext
}) => {
  const currencies = useSelector(getOraclesByNetwork);

  return (
    <div className="relative mt-7 w-full flex flex-col">
      {title}
      {currentStep > stepValue && (
        <Button className="capitalize absolute right-0 py-1 w-32 text-sm" onClick={() => onBack()}>
          Back step
        </Button>
      )}
      {currentStep === stepValue && (
        <div
          className={cx(
            'rounded mt-11 py-8 bg-[#29263f] border border-solid border-primary',
            'ml-60 flex justify-between gap-x-24 px-12 mx-auto relative'
          )}>
          <Table title="List of currencies" className="w-[270px] h-[160px] overflow-y-auto">
            {currencies.map((c) => (
              <div
                key={c.symbol}
                onClick={() => onAddCurrency(c)}
                className="uppercase flex justify-between items-center cursor-pointer px-3 py-2 hover:bg-tableHoverBg">
                <TokenIcon showName name={c.symbol} borderWidth={0} size={24} />
                <PlusCircleFilled className="text-primary" style={{ fontSize: 22 }} />
              </div>
            ))}
          </Table>
          <Table title="Selected currencies" className="w-[270px] h-[160px] overflow-y-auto">
            {addedCurrencies.map((c) => (
              <div
                key={c.symbol}
                onClick={() => onRemoveCurrency(c)}
                className="uppercase flex justify-between items-center cursor-pointer px-3 py-2 hover:bg-tableHoverBg">
                <TokenIcon showName name={c.symbol} borderWidth={0} size={24} />
                <MinusCircleFilled className="text-primary" style={{ fontSize: 22 }} />
              </div>
            ))}
          </Table>
          <span className="absolute left-0 -bottom-8 text-xs text-gray-400 w-full text-center">
            Don’t find your currency ? Make a{' '}
            <Link className="text-primary" to="/oracle/new-proposal">
              New Proposal
            </Link>{' '}
            to onboard your currency now !
          </span>
          <Button
            disabled={!addedCurrencies.length}
            onClick={() => onNext()}
            className="capitalize absolute right-0 -bottom-12 py-1 w-24 text-base">
            Next
          </Button>
        </div>
      )}
    </div>
  );
};

export default SelectCurrencyStep;
