import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import FadeIn from 'react-fade-in';
import { Antd } from 'components';
import { IAccount } from 'pages/Oracle/types';
import { Card, Expand, Empty, FilterSection } from './components';
import { IOracleSubscribed } from 'types/oracle';
import { RootState } from 'modules/rootReducer';
import { getSelectedAccount } from 'modules/account/reducer';
import { getMySubscriptions } from 'modules/oracles/reducer';
import { getDataSourceMap, getSupportedNetworks } from 'modules/common/reducer';

const { Row, Col } = Antd;
type TProps = {
  selectedAccount: IAccount | null;
  tokens: IOracleSubscribed[];
  dataSourceMap: { [key: number]: string };
  supportedNetworks: { chainId: number; id: number; name: string }[];
};

const OracleSubscription: React.FC<TProps> = ({ tokens, dataSourceMap }) => {
  const [filteredTokens, setFilteredTokens] = useState(tokens);
  const [selectedId, setSelectedId] = useState<number>(-1);
  const [selectedOrder, setSelectedOrder] = useState<number>(-1);
  const selectedToken = filteredTokens.find((t) => t.id === selectedId);

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
  }, [tokens, setFilteredTokens]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchStr = e.target.value;
    if (!searchStr) {
      return setFilteredTokens(tokens);
    }
    const list = tokens.filter((token) =>
      token.symbol.toLowerCase().includes(searchStr.toLowerCase())
    );
    return setFilteredTokens(list);
  };

  return (
    <FadeIn>
      {!tokens.length && <Empty />}
      {!!tokens.length && (
        <>
          <FilterSection onSearch={handleSearch} />
          <Row
            gutter={[
              { sm: 24, md: 32 },
              { xs: 16, sm: 24, md: 32 }
            ]}>
            {selectedToken && (
              <Col
                span={24}
                order={selectedOrder}
                xs={{ order: selectedOrder + 1 }}
                md={{ order: Math.ceil(selectedOrder / 2) * 2 + 1 }}
                lg={{ order: Math.ceil(selectedOrder / 3) * 3 + 1 }}
                xl={{ order: Math.ceil(selectedOrder / 4) * 4 + 1 }}>
                <FadeIn>
                  <Expand onCollapse={() => setSelectedId(-1)} {...selectedToken} />
                </FadeIn>
              </Col>
            )}
            {(filteredTokens || tokens).map((token, idx) => (
              <Col
                key={`${token.symbol}_${token.id}`}
                xs={{ span: 24 }}
                md={{ span: 12 }}
                lg={{ span: 8 }}
                xl={{ span: 6 }}
                order={idx + 1}>
                <FadeIn delay={100 * (idx + 1)}>
                  <Card
                    isActive={selectedId === token.id}
                    dataSourceMap={dataSourceMap}
                    onClick={() => {
                      if (selectedId === token.id) {
                        setSelectedId(-1);
                        return;
                      }
                      setSelectedId(token.id);
                      setSelectedOrder(idx + 1);
                    }}
                    {...token}
                  />
                </FadeIn>
              </Col>
            ))}
          </Row>
        </>
      )}
    </FadeIn>
  );
};

const mapStateToProps = (state: RootState) => ({
  selectedAccount: getSelectedAccount(state),
  tokens: getMySubscriptions(state),
  dataSourceMap: getDataSourceMap(state),
  supportedNetworks: getSupportedNetworks(state)
});

export default connect(mapStateToProps)(OracleSubscription);
