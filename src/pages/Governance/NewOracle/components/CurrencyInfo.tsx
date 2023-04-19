import { useSelector } from 'react-redux';
import { Selector } from 'components';
import { getClientMap, getClients, getConfig } from 'modules/common/reducer';

type TProps = {
  className?: string;
  highlightMissingField: boolean;
  clientType: string;
  symbol: string;
  slug: string;
  parachainName: string;
  parachainUrl: string;
  feedId: string;
  onChangeSymbol: (...args: any) => {} | void;
  onChooseClientType: (...args: any) => {} | void;
  onChangeSlug: (...args: any) => {} | void;
  onChangeParachainName: (...args: any) => {} | void;
  onChangeParachainUrl: (...args: any) => {} | void;
  onChangeFeedId: (...args: any) => {} | void;
};

const CurrencyInfo: React.FC<TProps> = ({
  highlightMissingField,
  symbol,
  clientType,
  slug,
  feedId,
  parachainUrl,
  parachainName,
  onChangeSymbol,
  onChangeParachainUrl,
  onChooseClientType,
  onChangeSlug,
  onChangeParachainName,
  onChangeFeedId
}) => {
  const config = useSelector(getConfig);
  const clientOptions = useSelector(getClients);
  const clientMap = useSelector(getClientMap);
  const clientLabel = clientMap[+clientType];
  const renderContractCard = () => {
    return (
      <div className="w-full flex justify-center items-center relative text-primary bg-[#2a324d] m-[18px]">
        Contract address will be displayed after proposal execution
        <div className="absolute left-6 top-3 text-primary">Client details</div>
      </div>
    );
  };
  const renderSubstrateCard = () => {
    return (
      <div className="w-full flex flex-col justify-between py-3 px-6 bg-[#2a324d] m-[18px]">
        <div className="text-sm text-primary text-left mb-3">Client details</div>
        <div className="flex justify-between">
          <div className="text-white text-left">Parachain Name</div>
          <input
            className={`bg-[#ffffff1a] rounded min-w-[260px] text-center outline-0 border-0 not-italic font-medium px-3 py-1 
              placeholder:text-[#2a324d] focus:placeholder:text-transparent ${
                highlightMissingField && !parachainName
                  ? '!outline-1 outline outline-[#FF0000]'
                  : ''
              }`}
            type="text"
            placeholder="key in here"
            value={parachainName}
            onChange={onChangeParachainName}></input>
        </div>
        <div className="flex justify-between">
          <div className="text-white text-left">Parachain Url</div>
          <input
            className={`bg-[#ffffff1a] rounded min-w-[260px] text-center outline-0 border-0 not-italic font-medium px-3 py-1 
              placeholder:text-[#2a324d] focus:placeholder:text-transparent ${
                highlightMissingField && !parachainUrl ? '!outline-1 outline outline-[#FF0000]' : ''
              }`}
            type="text"
            placeholder="key in here"
            value={parachainUrl}
            onChange={onChangeParachainUrl}></input>
        </div>
        <div className="flex justify-between">
          <div className="text-white text-left">Feed ID</div>
          <input
            className={`bg-[#ffffff1a] rounded min-w-[260px] text-center outline-0 border-0 not-italic font-medium px-3 py-1 
              placeholder:text-[#2a324d] focus:placeholder:text-transparent ${
                highlightMissingField && !feedId ? '!outline-1 outline outline-[#FF0000]' : ''
              }`}
            type="text"
            placeholder="key in here"
            value={feedId}
            onChange={onChangeFeedId}></input>
        </div>
      </div>
    );
  };
  return (
    <div className="flex  w-full mt-8">
      <div className="w-60 relative">
        <div className="absolute w-6 h-0.5 left-0 top-[7px] bg-[#00d7d7]"></div>
        <div className="absolute left-[26px] top-0 text-xs font-medium">Provide Currency Info</div>
      </div>
      <div className="flex  w-full h-[200px] rounded bg-[#00D7D7] bg-opacity-10">
        <div className="flex flex-col justify-between py-[35px] px-7">
          <div className="flex ">
            <div className="w-20 text-white text-left">Symbol</div>
            <input
              className={`bg-[#194a61] rounded w-[210px] outline-0 border-0 not-italic font-medium px-3 py-1 
              placeholder:text-[#2a324d] focus:placeholder:text-transparent ${
                highlightMissingField && !symbol ? '!outline-1 outline outline-[#FF0000]' : ''
              }`}
              type="text"
              placeholder="Input Symbol"
              value={symbol}
              maxLength={config?.symbolSize || 8}
              onChange={onChangeSymbol}></input>
          </div>
          <div className="flex  mt-5">
            <div className="w-20 text-white text-left">Slug</div>
            <input
              className={`bg-[#194a61] rounded w-[210px] outline-0 border-0 not-italic font-medium px-3 py-1 
              placeholder:text-[#2a324d] focus:placeholder:text-transparent ${
                highlightMissingField && !slug ? '!outline-1 outline outline-[#FF0000]' : ''
              }`}
              type="text"
              placeholder="Input Slug"
              value={slug}
              maxLength={config?.slugSize || 32}
              onChange={onChangeSlug}></input>
          </div>
          <div className="flex  mt-5">
            <div className="w-20 text-white text-left">Client</div>
            <div className="w-[210px]">
              <Selector
                className="text-primary bold"
                options={clientOptions}
                defaultValue={clientType}
                onChange={onChooseClientType}
                placeholder={
                  <div className={highlightMissingField ? 'text-[#ff0000]' : 'text-[#0b98a3]'}>
                    Choose Client Type
                  </div>
                }
              />
            </div>
          </div>
        </div>
        <div className="w-1/4"></div>
        {clientLabel === 'Substrate' ? renderSubstrateCard() : renderContractCard()}
      </div>
    </div>
  );
};

export default CurrencyInfo;
