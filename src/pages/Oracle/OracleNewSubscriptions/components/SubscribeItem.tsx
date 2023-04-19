import { connect } from 'react-redux';
import chunk from 'lodash/chunk';
import { IOracleWithSubscribeState } from 'types/oracle';
import oracleActions from 'modules/oracles/actions';
import { getDataSourceMap, getLeasePeriodOptions } from 'modules/common/reducer';
import { TokenIcon, Antd, Selector } from 'components';
import { TrashCanIcon } from 'resources/icons';
import ClientDetailSection from './ClientDetailSection';
import styles from './SubscribeItem.module.scss';

const { Row, Col } = Antd;

type TProps = {
  token: IOracleWithSubscribeState;
  highlightMissingField: boolean;
  dataSourceMap: { [key: number]: string };
  leasePeriodOptions: any[];
  removeFromSubscribeList: (...args: any) => {};
  updateSubscribeLeasePeriod: (...args: any) => {};
  updateSubscribeClientType: (...args: any) => {};
  updateSubstrateClientInfo: (...args: any) => {};
};

const SubscribeItem: React.FC<TProps> = ({
  token,
  highlightMissingField,
  dataSourceMap = {},
  leasePeriodOptions = [],
  removeFromSubscribeList,
  updateSubscribeLeasePeriod,
  updateSubscribeClientType,
  updateSubstrateClientInfo
}) => {
  const { indexedSubscriptionId } = token;

  const removeToken = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    removeFromSubscribeList(indexedSubscriptionId);
  };

  const setParachainName = (name: string) => {
    updateSubstrateClientInfo({
      key: indexedSubscriptionId,
      field: 'parachainName',
      value: name
    });
  };

  const setParachainUrl = (url: string) => {
    updateSubstrateClientInfo({
      key: indexedSubscriptionId,
      field: 'parachainUrl',
      value: url
    });
  };

  const setFeedId = (value: string) => {
    updateSubstrateClientInfo({
      key: indexedSubscriptionId,
      field: 'feedId',
      value: value
    });
  };

  const onChooseLeasePeriod = (value: string) => {
    updateSubscribeLeasePeriod({
      key: indexedSubscriptionId,
      value: value
    });
  };

  const onChooseClientType = (value: string) => {
    updateSubscribeClientType({
      key: indexedSubscriptionId,
      value: value
    });
  };

  const sourceChunks = chunk(token.sources, 4);

  const getDefaultLeasePeriod = (time: string) => {
    return leasePeriodOptions.find((i) => i.value === +time)?.label || null;
  };

  return (
    <Row className={styles.container}>
      <Col xs={24} sm={24} md={24} lg={24} xl={11} xxl={11}>
        <Row gutter={[16, 0]}>
          <Col span={6} className={styles.nameContainer}>
            <TokenIcon size={28} borderWidth={2} name={token.symbol} />
            <div className={styles.symbol}>{token.symbol}</div>
          </Col>
          <Col span={16} className={styles.settingsContainer}>
            <div className={styles.row}>
              <div className={styles.name}>Aggregation Strategy:</div>
              <div className={styles.value}>TWAP</div>
            </div>
            <div className={styles.row}>
              <div className={styles.name}>Lease Period:</div>
              <Selector
                options={leasePeriodOptions}
                placeholder={
                  highlightMissingField ? (
                    <div className={styles.missingOption}>Choose Lease Period</div>
                  ) : (
                    <div className={styles.defaultOption}>Choose Lease Period</div>
                  )
                }
                defaultValue={token.leasePeriod ? getDefaultLeasePeriod(token.leasePeriod) : null}
                className={styles.value}
                onChange={onChooseLeasePeriod}
              />
            </div>
            <div className={styles.row}>
              <div className={styles.name}>Client:</div>
              <Selector
                options={[
                  { label: 'Contract', value: 'Contract' },
                  { label: 'Substrate', value: 'Substrate' }
                ]}
                placeholder={
                  highlightMissingField ? (
                    <div className={styles.missingOption}>Choose Client Type</div>
                  ) : (
                    <div className={styles.defaultOption}>Choose Client Type</div>
                  )
                }
                defaultValue={token.clientType ? token.clientType : undefined}
                className={styles.value}
                onChange={onChooseClientType}
              />
            </div>
          </Col>
        </Row>
      </Col>
      <Col xs={24} sm={24} md={24} lg={24} xl={13} xxl={13}>
        <Row gutter={16} className="h-full">
          <Col span={14} className={styles.clientDetailsContainer}>
            <ClientDetailSection
              token={token}
              highlightMissingField={highlightMissingField}
              setParachainName={setParachainName}
              setParachainUrl={setParachainUrl}
              setFeedId={setFeedId}
            />
          </Col>
          <Col span={10} className={styles.sourcesContainer}>
            <Row justify="start" gutter={[8, 16]}>
              {sourceChunks.map((chunkItem, index) => (
                <Col span={12} key={`chunk-${index}`}>
                  {chunkItem.map((source) => (
                    <Row key={source} className="mb-2">
                      <TokenIcon
                        className="text-white font-medium"
                        size={20}
                        borderWidth={0}
                        name={dataSourceMap[source]}
                        showName
                      />
                    </Row>
                  ))}
                </Col>
              ))}
            </Row>
          </Col>
          <a href="#" onClick={removeToken} className={styles.removeContainer}>
            <TrashCanIcon />
          </a>
        </Row>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state: any) => ({
  dataSourceMap: getDataSourceMap(state),
  leasePeriodOptions: getLeasePeriodOptions(state)
});

const mapDispatchToProps = {
  removeFromSubscribeList: oracleActions.REMOVE_TO_BE_SUBSCRIBED,
  updateSubscribeLeasePeriod: oracleActions.UPDATE_SUBSCRIBE_LEASE_PERIOD,
  updateSubscribeClientType: oracleActions.UPDATE_SUBSCRIBE_CLIENT_TYPE,
  updateSubstrateClientInfo: oracleActions.UPDATE_SUBSTRATE_CLIENT_INFO
};

export default connect(mapStateToProps, mapDispatchToProps)(SubscribeItem);
