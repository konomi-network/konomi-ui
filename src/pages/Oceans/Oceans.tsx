import React, { useEffect, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import FadeIn from 'react-fade-in';
import { Antd, Spinner } from 'components';
import { RootState } from 'modules/rootReducer';
import { getIsFetchingOceans, getOceansByNetwork } from 'modules/oceans/reducer';

import { IOcean } from 'types/ocean';
import { Card, Expand, Empty, FilterSection } from './components';
import useOceanLendingContract from 'hooks/useOceanLendingContract';

const { Row, Col } = Antd;

type TProps = {
  oceans: IOcean[];
};

const Oceans: React.FC<TProps> = ({ oceans }) => {
  const { getOceans } = useOceanLendingContract();
  const isFetching = useSelector(getIsFetchingOceans);

  const [filteredOceans, setFilteredOceans] = useState(oceans);
  const [selectedId, setSelectedId] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<number>(-1);
  const selectedOcean = filteredOceans.find((t) => t.id === selectedId);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchStr = e.target.value;
    if (!searchStr) {
      return setFilteredOceans(oceans);
    }
    const list = oceans.filter((ocean) => ocean.id.toLowerCase().includes(searchStr.toLowerCase()));
    return setFilteredOceans(list);
  };

  const renderContent = () => {
    if (isFetching) return <Spinner />;
    if (!isFetching && !filteredOceans.length) return <Empty />;
    return (
      <>
        <Row gutter={[36, 36]} align="top" wrap>
          {selectedOcean && (
            <Col
              span={24}
              order={selectedOrder}
              xs={{ order: selectedOrder + 1 }}
              md={{ order: Math.ceil(selectedOrder / 2) * 2 + 1 }}
              lg={{ order: Math.ceil(selectedOrder / 3) * 3 + 1 }}
              xl={{ order: Math.ceil(selectedOrder / 4) * 4 + 1 }}>
              <FadeIn>
                <Expand {...selectedOcean} />
              </FadeIn>
            </Col>
          )}
          {(filteredOceans || oceans).map((ocean, idx) => (
            <Col
              key={ocean.id}
              xs={{ span: 24 }}
              md={{ span: 12 }}
              lg={{ span: 8 }}
              xl={{ span: 6 }}
              order={idx + 1}>
              <FadeIn delay={100 * (idx + 1)}>
                <Card
                  isActive={selectedId === ocean.id}
                  onClick={() => {
                    if (selectedId === ocean.id) {
                      setSelectedId('');
                      return;
                    }
                    setSelectedId(ocean.id);
                    setSelectedOrder(idx + 1);
                  }}
                  {...ocean}
                />
              </FadeIn>
            </Col>
          ))}
        </Row>
      </>
    );
  };

  useEffect(() => {
    getOceans();
  }, [getOceans]);

  useEffect(() => {
    if (!selectedOcean) {
      setSelectedId('');
      return;
    }
    const newOrder = filteredOceans.findIndex((p) => p.id === selectedOcean.id) + 1;
    if (newOrder !== selectedOrder) setSelectedOrder(newOrder);
  }, [filteredOceans, selectedOcean, selectedOrder, setSelectedOrder, setSelectedId]);

  useEffect(() => {
    setFilteredOceans(oceans);
  }, [oceans]);

  return (
    <div className="w-full">
      <FadeIn>
        <FilterSection
          onSearch={handleSearch}
          onSortChange={(by: 'minBorrowAPY' | 'maxSupplyAPY' | 'totalLiquidity') => {
            setFilteredOceans(filteredOceans.sort((a, b) => b[by] - a[by]));
          }}
        />
        {renderContent()}
      </FadeIn>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  oceans: getOceansByNetwork(state)
});

export default connect(mapStateToProps)(Oceans);
