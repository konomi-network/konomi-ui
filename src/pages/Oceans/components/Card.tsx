import { IOcean } from 'types/ocean';
import { displayFloat } from 'utils/formatter';
import { Antd, TokenIconGridList, TokenStatus } from 'components';

type TProps = IOcean & {
  isActive: boolean;
  onClick: () => void | {};
};

const Card: React.FC<TProps> = (props) => {
  const {
    onClick,
    isActive,
    id,
    status,
    minBorrowAPY,
    maxSupplyAPY,
    totalLiquidity,
    isLoading,
    currencies
  } = props;

  return (
    <div
      className={`bg-[#29263f] relative cursor-pointer py-5 px-4 text-primary min-w-[306px] rounded-md hover:outline hover:outline-1 hover:outline-primary ${
        isActive ? 'outline-1  outline outline-primary' : ''
      }`}
      onClick={onClick}>
      <h3 className="text-primary font-bold text-2xl text-left">Ocean-{id}</h3>
      <TokenStatus status={status} className="absolute right-4 top-5" />
      <div className="text-left mt-4">
        <span className="block text-primary text-xs">Ocean Size (USD)</span>
        <span className="block text-white font-medium text-3xl whitespace-nowrap overflow-hidden text-ellipsis">
          <Antd.Skeleton
            className="h-9 flex items-center"
            title={false}
            paragraph={{ rows: 1, width: 100 }}
            loading={isLoading}
            active>
            {displayFloat(totalLiquidity)}
          </Antd.Skeleton>
        </span>
      </div>
      <div className="flex items-end justify-between min-h-[76px]">
        <div className="flex items-end mt-4">
          <div className="text-left mr-4">
            <span className="block text-primary text-xs">Min Borrow APY</span>
            <span className="block text-white font-medium text-lg">
              <Antd.Skeleton
                className="h-7 flex items-center"
                title={false}
                paragraph={{ rows: 1, width: '100%' }}
                loading={isLoading}
                active>
                {displayFloat(minBorrowAPY)}%
              </Antd.Skeleton>
            </span>
          </div>
          <div className="text-left">
            <span className="block text-primary text-xs">Max Supply APY</span>
            <span className="block text-white font-medium text-lg">
              <Antd.Skeleton
                className="h-7 flex items-center"
                title={false}
                paragraph={{ rows: 1, width: '100%' }}
                loading={isLoading}
                active>
                {displayFloat(maxSupplyAPY)}%
              </Antd.Skeleton>
            </span>
          </div>
        </div>
        <div className="ml-2">
          <div className="text-primary text-right text-xs">Currencies</div>
          <Antd.Skeleton
            className="h-7 flex items-center"
            paragraph={{ rows: 1, width: '100%' }}
            title={false}
            loading={isLoading}
            active>
            {<TokenIconGridList data={currencies.map((p) => ({ symbol: p.underlyingSymbol }))} />}
          </Antd.Skeleton>
        </div>
      </div>
    </div>
  );
};

export default Card;
