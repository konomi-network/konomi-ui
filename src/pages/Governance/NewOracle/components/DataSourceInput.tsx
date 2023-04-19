import { useMemo } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import MinusCircleFilled from '@ant-design/icons/MinusCircleFilled';
import PlusCircleFilled from '@ant-design/icons/PlusCircleFilled';
import { TokenIcon } from 'components';
import { TDataSource, IProposalSelectedDataSource } from 'types/oracleProposal';
import useOracleNewProposal from 'hooks/useOracleNewProposal';

type TProps = {
  className?: string;
  highlightMissingField: boolean;
  coinId: string;
  targetAddresses: Record<string, string>;
  selectedDataSources: IProposalSelectedDataSource;
  dataSources: TDataSource[];
  selectedDataSource?: TDataSource | null;
  onChangeCoinId: (...args: any) => {} | void;
  onChangeAddress: (...args: any) => {} | void;
  setSelectedDataSources: (...args: any) => {} | void;
  setSelectedDataSource: (...args: any) => {} | void;
  hasValidAddresses: boolean;
};

const DataSourceInput: React.FC<TProps> = ({
  dataSources,
  targetAddresses,
  coinId,
  highlightMissingField,
  setSelectedDataSource,
  setSelectedDataSources,
  selectedDataSources,
  selectedDataSource,
  onChangeCoinId,
  onChangeAddress,
  hasValidAddresses
}) => {
  const { sourcesRequireCoinId, sourcesRequireAddress, sourcesIdWithAddress, sourcesIdWithCoinId } =
    useOracleNewProposal();

  const { value: selectedDsValue = '' } = selectedDataSource || {};
  const hasDataSource = Object.values(selectedDataSources).find((value) => value);
  const selectedDsTargetAddress = targetAddresses[selectedDsValue];
  const coinIdRequired = sourcesIdWithCoinId.includes(selectedDsValue);

  const missCoinId = sourcesRequireCoinId(selectedDataSources) && !coinId;
  const missAddress = sourcesRequireAddress(selectedDataSources) && !hasValidAddresses;
  const isMissingDataSource = highlightMissingField && (missCoinId || missAddress);

  const renderDataSourceDetails = (() => {
    if (!selectedDataSource || !hasDataSource) {
      return false;
    }

    if (![...sourcesIdWithCoinId, ...sourcesIdWithAddress].includes(selectedDsValue)) {
      return false;
    }

    return true;
  })();

  const renderPlaceHolder = useMemo(() => {
    if (isMissingDataSource) {
      return (
        <div className="absolute left-0 top-0 text-base text-left text-[#FF0000]">
          Missing data source fields
        </div>
      );
    }

    return null;
  }, [isMissingDataSource]);

  const handleSelectDataSource = (
    e: React.MouseEvent<Element, MouseEvent>,
    ds: { value: string }
  ) => {
    e.stopPropagation();
    const { value } = ds;

    // Set selected dataSource
    setSelectedDataSources((prev: any) => ({
      ...prev,
      [value]: true
    }));

    // Check if require address, if yes set empty dataSource
    if (sourcesIdWithAddress.includes(value)) {
      onChangeAddress(value, '');
    }
  };

  const handleUnSelectDataSource = (
    e: React.MouseEvent<Element, MouseEvent>,
    ds: { value: string | number }
  ) => {
    e.stopPropagation();

    setSelectedDataSources((prev: any) => {
      const res = cloneDeep(prev);
      delete res[ds.value];
      return res;
    });

    if (selectedDataSource && ds.value === selectedDataSource.value) {
      setSelectedDataSource(null);
    }
  };

  return (
    <div className="flex w-full mt-1">
      <div className="w-60 relative">
        <div className="absolute w-6 h-0.5 left-0 top-[7px] bg-[#00d7d7]"></div>
        <div className="absolute left-[26px] top-0 text-xs font-medium">Choose Data Source</div>
      </div>
      <div className="flex w-full h-[250px] rounded bg-[#00D7D7] bg-opacity-10 p-6">
        <div className="flex w-[30%] flex-col justify-between pr-8">
          <div className="text-white text-left text-base">Data Source</div>
          <div className="h-[164px] border border-primary rounded overflow-hidden overflow-y-scroll">
            {dataSources?.map((ds: any) => (
              <div
                className="flex w-full h-[41px] cursor-pointer items-center hover:bg-[#194a61] first:h-10 last:h-10"
                key={ds.label}>
                <div className="flex w-full py-0 px-4">
                  <TokenIcon size={22} borderWidth={0} name={ds.label} withBackground={false} />
                  <span className="ml-4 text-white">{ds.label || 'Coingecko'}</span>
                </div>
                <PlusCircleFilled
                  className="w-[22px] h-[22px] mr-2.5"
                  style={{ fontSize: 22 }}
                  onClick={(e) => handleSelectDataSource(e, ds)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Data Source */}
        <div className="flex flex-col justify-between w-[30%] pr-8">
          <div className="text-white text-left text-base">Selected Data Source</div>
          <div
            className={`h-[164px] bg-[#194a61] rounded outline-0 border-0 overflow-y-auto max-w-[260px] ${
              highlightMissingField && !hasDataSource ? '!outline-1  outline outline-[#FF0000]' : ''
            }`}>
            {Object.entries(selectedDataSources).map(([key, value]) => {
              const ds =
                dataSources.find((element: any) => element.value === key) || ({} as TDataSource);
              const { value: dsValue, label } = ds;

              if (!value && !ds) {
                return null;
              }

              return (
                <div
                  className={`flex w-full h-10 cursor-pointer items-center first:h-10 last:h-10 ${
                    selectedDataSource && dsValue === selectedDataSource.value ? 'bg-[#0b98a3]' : ''
                  }`}
                  key={label}
                  onClick={() => {
                    setSelectedDataSource(ds);
                  }}>
                  <div className="flex w-full py-0 px-4">
                    <TokenIcon size={22} borderWidth={0} name={label} withBackground={false} />
                    <span className="ml-4 text-white">{label || 'Coingecko'}</span>
                  </div>
                  <MinusCircleFilled
                    className="w-[22px] h-[22px] mr-2.5"
                    style={{ fontSize: 22 }}
                    onClick={(e) => handleUnSelectDataSource(e, ds)}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Data Source Address */}
        <div className="w-[40%] flex flex-col justify-end relative">
          {renderPlaceHolder}
          {renderDataSourceDetails && (
            <div className="w-full h-[164px] bg-[#2a324d] rounded overflow-hidden overflow-y-scroll py-[14px] px-4">
              <div className="flex justify-between w-full text-center">
                <div className="not-italic text-white">
                  {coinIdRequired ? 'Coin ID' : 'Address'}
                </div>
                <input
                  className={`w-[185px] py-0.5 px-2 outline-0 text-center bg-[#ffffff33] border-0 placeholder:text-[#0000004d] focus:placeholder:text-transparent rounded ${
                    highlightMissingField && (coinIdRequired ? !coinId : !selectedDsTargetAddress)
                      ? '!outline-1  outline outline-[#FF0000]'
                      : ''
                  }`}
                  type="text"
                  name={selectedDsValue}
                  placeholder="key in here"
                  value={coinIdRequired ? coinId : selectedDsTargetAddress}
                  onChange={(e) => {
                    const { value, name } = e.target;

                    if (coinIdRequired) {
                      onChangeCoinId(e);
                      return;
                    }

                    onChangeAddress(name, value);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DataSourceInput;
