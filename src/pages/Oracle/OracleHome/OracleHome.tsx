import { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import FadeIn from 'react-fade-in';

import { IOracle } from 'types/oracle';
import { RootState } from 'modules/rootReducer';
import oracleActions from 'modules/oracles/actions';
import { getIsFetchingOracles, getOraclesByNetwork } from 'modules/oracles/reducer';
import { TokenCard, SearchBar, Spinner, Antd } from 'components';
import { Empty, SubscriptionBasket } from './components';

import styles from './OracleHome.module.scss';

const { Row, Col } = Antd;
// TODO: sync and correct props type
type TProps = {
  tokens: IOracle[];
  addToSubscribeList: any;
  removeFromSubscribeList: any;
};

const OracleHome: React.FC<TProps> = ({
  tokens,
  addToSubscribeList,
  removeFromSubscribeList
}: TProps) => {
  const isFetching = useSelector(getIsFetchingOracles);
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [selectedOrder, setSelectedOrder] = useState<number>(-1);
  const selectedToken = filteredTokens.find((t) => t.subscriptionId === selectedId);

  useEffect(() => {
    if (!selectedToken) {
      setSelectedId(-1);
      return;
    }
    const newOrder =
      filteredTokens.findIndex((p) => p.subscriptionId === selectedToken.subscriptionId) + 1;
    if (newOrder !== selectedOrder) setSelectedOrder(newOrder);
  }, [filteredTokens, selectedToken, selectedOrder, setSelectedOrder, setSelectedId]);

  useEffect(() => {
    setFilteredTokens(tokens);
  }, [tokens]);

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchStr: string = e.target.value;
    if (!searchStr) {
      return setFilteredTokens(tokens);
    }
    const list = tokens.filter((token: { symbol: string }) =>
      token.symbol.toLowerCase().includes(searchStr.toLowerCase())
    );
    return setFilteredTokens(list);
  };

  const renderContent = () => {
    if (isFetching) {
      return <Spinner />;
    }

    if (!isFetching && !tokens.length) {
      return <Empty />;
    }

    return (
      <Row gutter={[36, 36]}>
        {selectedToken && (
          <Col
            span={24}
            order={selectedOrder}
            xs={{ order: selectedOrder + 1 }}
            md={{ order: Math.ceil(selectedOrder / 2) * 2 + 1 }}
            lg={{ order: Math.ceil(selectedOrder / 3) * 3 + 1 }}
            xl={{ order: Math.ceil(selectedOrder / 4) * 4 + 1 }}>
            <FadeIn>
              <TokenCard.Expand
                {...selectedToken}
                onCollapse={() => setSelectedId(-1)}
                onAdd={() => addToSubscribeList(selectedToken.indexedSubscriptionId)}
                onRemove={() => removeFromSubscribeList(selectedToken.indexedSubscriptionId)}
              />
            </FadeIn>
          </Col>
        )}
        {(filteredTokens || tokens).map((token, idx: number) => (
          <Col
            key={token.subscriptionId}
            sm={{ span: 24 }}
            md={{ span: 12 }}
            lg={{ span: 8 }}
            xl={{ span: 6 }}
            order={idx + 1}>
            <FadeIn delay={50 * (idx + 1)}>
              <TokenCard.Main
                className={styles.card}
                active={selectedId === token.subscriptionId}
                onAdd={() => addToSubscribeList(token.indexedSubscriptionId)}
                onRemove={() => removeFromSubscribeList(token.indexedSubscriptionId)}
                onClick={() => {
                  if (selectedId === token.subscriptionId) {
                    return setSelectedId(-1);
                  }
                  setSelectedId(token.subscriptionId);
                  setSelectedOrder(idx + 1);
                }}
                {...token}
              />
            </FadeIn>
          </Col>
        ))}
      </Row>
    );
  };

  return (
    <div className="w-full">
      <FadeIn>
        <div className="flex mb-8 justify-between">
          <SearchBar onSearch={onSearch} style={{ width: 340 }} />
          <SubscriptionBasket />
        </div>
        {renderContent()}
      </FadeIn>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  tokens: getOraclesByNetwork(state)
});

const mapDispatchToProps = {
  addToSubscribeList: oracleActions.ADD_TO_BE_SUBSCRIBED,
  removeFromSubscribeList: oracleActions.REMOVE_TO_BE_SUBSCRIBED
};

export default connect(mapStateToProps, mapDispatchToProps)(OracleHome);
