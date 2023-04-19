import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import includes from 'lodash/includes';
import ArrowLeftOutlined from '@ant-design/icons/ArrowLeftOutlined';

import { useIPFSClient } from 'contexts';
import { Button, Antd } from 'components';
import { PLATFORM } from 'config/settings';
import { displayFloat } from 'utils/formatter';
import { IAccount } from 'pages/Oracle/types';
import {
  IProposalClient,
  IProposalDataSource,
  IProposalSelectedDataSource,
  TDataSource
} from 'types/oracleProposal';
import { createIPFSProposal, createProposalClient } from 'utils/proposalConvertor';
import useGovernorContract from 'hooks/useGovernorContract';
import useKonoAllowance from 'hooks/useKonoAllowance';
import {
  getBlockTime,
  getClientMap,
  getDataSources,
  getLeasePeriodOptions
} from 'modules/common/reducer';
import { RootState } from 'modules/rootReducer';
import { getCurrentNetworkId } from 'modules/connection/reducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { CurrencyInfo, DataSourceInput, SubscriptionInput } from './components';
import useOracleNewProposal from 'hooks/useOracleNewProposal';

type TProps = {
  selectedAccount: IAccount | null;
  leasePeriodOptions: Array<any>;
  dataSources: TDataSource[];
  networkId?: number;
};

const NewOracle: React.FC<TProps> = ({
  selectedAccount,
  leasePeriodOptions,
  dataSources,
  networkId
}) => {
  const ipfs = useIPFSClient();
  const navigate = useNavigate();
  const { proposeOracle, getPayable, governorContract, isCreating, payable } =
    useGovernorContract();
  const { isIncreasing, allowance, onClickIncreaseAllowance } = useKonoAllowance(
    governorContract?.address
  );
  const blockTime = useSelector(getBlockTime);
  const clientMap = useSelector(getClientMap);

  const [highlightMissingField, setHighlightMissingField] = useState(false);
  const [symbol, setSymbol] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [clientType, setClientType] = useState<string>('0');
  const [parachainName, setParachainName] = useState<string>('');
  const [parachainUrl, setParachainUrl] = useState<string>('');
  const [feedId, setFeedId] = useState<string>('');

  const [selectedDataSources, setSelectedDataSources] = useState<IProposalSelectedDataSource>({});
  const [selectedDataSource, setSelectedDataSource] = useState<TDataSource | null>(null);
  const [targetAddresses, setTargetAddresses] = useState<Record<string, string>>({});

  const [coinId, setCoinId] = useState<string>('');
  const [aggregateStrategy, setAggregateStrategy] = useState<number>(1);
  const [leasePeriod, setLeasePeriod] = useState<number | undefined>();

  const { sourcesRequireCoinId, sourcesIdWithAddress, sourcesIdWithCoinId } =
    useOracleNewProposal();
  const clientLabel = clientMap[+clientType];

  const hasValidAddresses = Object.values(targetAddresses).reduce(
    (isValid, address) => isValid && !!address,
    true
  );

  useEffect(() => {
    getPayable();
  }, [getPayable]);

  const onChangeSymbol = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSymbol(e.target.value);
  };

  const onChangeSlug = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value);
  };

  const onChooseClientType = (value: string) => {
    setClientType(value);
  };

  const onChangeParachainName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParachainName(e.target.value);
  };

  const onChangeParachainUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
    setParachainUrl(e.target.value);
  };

  const onChangeFeedId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFeedId(e.target.value);
  };

  const onChangeCoinId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCoinId(e.target.value);
  };

  const onChangeAddress = (ds: string, address: string) => {
    setTargetAddresses({
      ...targetAddresses,
      [ds]: address
    });
  };

  const onChooseLeasePeriod = (value: number) => {
    console.log('🚀 ~  value', value);
    setLeasePeriod(value);
  };

  const validateFields = (): boolean => {
    const returnFalse = (): boolean => {
      setHighlightMissingField(true);
      return false;
    };

    if (!symbol || !slug) {
      return returnFalse();
    }

    if (clientLabel === 'Substrate') {
      if (!parachainName || !parachainUrl || !feedId) {
        return returnFalse();
      } else {
        // TODO: validate parachain info
      }
    }

    if (!leasePeriod) {
      return returnFalse();
    }

    if (!Object.values(selectedDataSources).find((value) => value)) {
      return returnFalse();
    }

    if (sourcesRequireCoinId(selectedDataSources) && !coinId) {
      return returnFalse();
    }
    if (!hasValidAddresses) {
      return returnFalse();
    }
    return true;
  };

  const getProposalClient = (): IProposalClient => {
    if (clientLabel === 'Contract') {
      return createProposalClient(0, {});
    }

    if (clientLabel === 'Substrate') {
      return createProposalClient(1, {
        parachainName,
        feedId,
        connectionUrl: parachainUrl
      });
    }
    return createProposalClient(0, {});
  };

  const createProposalJsonString = (): string => {
    if (networkId === undefined || leasePeriod === undefined) {
      return '';
    }

    setHighlightMissingField(false);
    const proposalClient = getProposalClient();

    // NEW
    const sources = Object.entries(selectedDataSources).reduce<IProposalDataSource[]>(
      (acc, [dsId, value]) => {
        if (!value) {
          return acc;
        }

        const hasSourcesIdWithCoinId = includes(sourcesIdWithCoinId, dsId);
        const hasSourcesIdWithAddress = includes(sourcesIdWithAddress, dsId);

        const detail = {
          ...(hasSourcesIdWithCoinId ? { coinId } : {}),
          ...(hasSourcesIdWithAddress ? { address: targetAddresses[dsId] } : {})
        };

        return [...acc, { type: parseInt(dsId), detail }];
      },
      []
    );

    const proposal = createIPFSProposal(
      symbol || '',
      slug || '',
      leasePeriod / blockTime,
      proposalClient,
      networkId,
      aggregateStrategy,
      sources
    );

    return JSON.stringify(proposal);
  };

  const onClickConfirm = async () => {
    if (validateFields() && networkId !== undefined && leasePeriod !== undefined) {
      const proposalString = createProposalJsonString();
      const cid = await ipfs.save(proposalString);
      const sources = Object.keys(selectedDataSources).filter(
        (value: any) => selectedDataSources[value]
      );

      if (sources.length > 0) {
        proposeOracle(
          {
            cid,
            clientType,
            sources,
            leasePeriod: (leasePeriod / blockTime).toString()
          },
          () => {
            navigate('/governance?tab=oracles');
          }
        );
      }
    }
  };

  const renderConfirmButton = () => {
    if (!selectedAccount?.address) {
      return (
        <Button className="py-2 capitalize" disabled>
          Connect a Wallet to Subscribe
        </Button>
      );
    }

    // TODO: Should compare with the estimated fee.
    if (allowance === 0 || allowance < payable) {
      return (
        <Button
          className="py-2 capitalize"
          onClick={() => onClickIncreaseAllowance()}
          isLoading={isIncreasing}>
          Increase Your KONO Allowance
        </Button>
      );
    }

    return (
      <div className="w-full h-9 flex justify-between">
        <Button
          isLoading={isCreating}
          className="w-full py-1.5 px-0 flex justify-center capitalize"
          onClick={() => onClickConfirm()}>
          Confirm
        </Button>
      </div>
    );
  };

  return (
    <div className="w-full">
      <Antd.PageHeader
        className="py-4 px-0"
        onBack={() => navigate('/governance')}
        backIcon={<ArrowLeftOutlined className="text-primary text-xl" />}
        title={<div className="text-primary font-semibold">New Oracle Proposal</div>}
      />
      <div className="flex w-full">
        <div className="bg-verticalSegment w-0.5"></div>
        <div className="flex flex-col w-full">
          <CurrencyInfo
            slug={slug}
            symbol={symbol}
            clientType={clientType}
            parachainUrl={parachainUrl}
            onChooseClientType={onChooseClientType}
            onChangeSymbol={onChangeSymbol}
            onChangeParachainName={onChangeParachainName}
            onChangeParachainUrl={onChangeParachainUrl}
            onChangeSlug={onChangeSlug}
            onChangeFeedId={onChangeFeedId}
            feedId={feedId}
            parachainName={parachainName}
            highlightMissingField={highlightMissingField}
          />
          <DataSourceInput
            coinId={coinId}
            onChangeCoinId={onChangeCoinId}
            dataSources={dataSources}
            setSelectedDataSource={setSelectedDataSource}
            setSelectedDataSources={setSelectedDataSources}
            selectedDataSource={selectedDataSource}
            selectedDataSources={selectedDataSources}
            onChangeAddress={onChangeAddress}
            highlightMissingField={highlightMissingField}
            targetAddresses={targetAddresses} //
            hasValidAddresses={hasValidAddresses} //
          />

          <SubscriptionInput
            aggregateStrategy={aggregateStrategy}
            leasePeriodOptions={leasePeriodOptions}
            setAggregateStrategy={setAggregateStrategy}
            onChooseLeasePeriod={onChooseLeasePeriod}
            highlightMissingField={highlightMissingField}
          />
        </div>
      </div>
      <div className="flex justify-end mt-7">
        <div className="flex flex-col">
          <div className="w-[400px] h-[70px] relative mb-2 border border-primary rounded box-border">
            <div className="absolute top-2 left-3 font-normal text-sm text-primary">
              Estimated operation fee:
            </div>
            <div className="absolute right-3 bottom-2 font-bold text-primary">{`${displayFloat(
              payable,
              4
            )} ${PLATFORM.tokenName}`}</div>
          </div>
          {renderConfirmButton()}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedAccount: getSelectedAccount(state),
  leasePeriodOptions: getLeasePeriodOptions(state),
  dataSources: getDataSources(state),
  networkId: getCurrentNetworkId(state)
});

export default connect(mapStateToProps)(NewOracle);
