import cx from 'classnames';
import { TokenIcon, Antd } from 'components';
import { SourceList } from 'components/TokenCard/components';
import { useSelector } from 'react-redux';
import { IOracleProposal } from 'types/oracleProposal';
import styles from './Card.module.scss';

const { Col, Skeleton } = Antd;

type TProps = IOracleProposal & {
  isActive: boolean;
  onClick: (e: any) => void | {};
};

const Card: React.FC<TProps> = (props: TProps) => {
  const { isActive, ipfsData, ipfsError, onClick } = props;
  const { slug, symbol, sources } = ipfsData || {};
  const dataSourceMap = useSelector((state: any) => state.common.dataSource);

  return (
    <div
      className={cx(styles.card, {
        [styles.active]: isActive
      })}
      onClick={onClick}>
      <div className="flex">
        <TokenIcon name={symbol} size={74} borderWidth={4} />
        <div className="flex flex-col text-left ml-6">
          <div className="flex flex-col w-max mb-2">
            <span className="text-primary text-xs">Symbol</span>
            <span className="font-semibold text-lg">
              <Skeleton
                className={cx(styles.skeleton, 'flex items-center')}
                paragraph={false}
                loading={!symbol && !ipfsError}
                active>
                {symbol || '--'}
              </Skeleton>
            </span>
          </div>
          <div className="flex flex-col w-max">
            <span className="text-primary text-xs">Slug</span>
            <span className="font-semibold text-lg">
              <Skeleton
                className={cx(styles.skeleton, 'flex items-center')}
                paragraph={false}
                loading={!slug && !ipfsError}
                active>
                {slug || '--'}
              </Skeleton>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end text-right mb-auto">
        <span className="text-primary text-xs block">Sources</span>
        <SourceList className="mt-2" data={sources?.map((s) => s.type) || []} map={dataSourceMap} />
      </div>
    </div>
  );
};

const CardWrapper: React.FC<any> = (props: any) => {
  return <Col span={24} sm={{ span: 12 }} lg={{ span: 8 }} xl={{ span: 6 }} {...props}></Col>;
};

export { Card, CardWrapper };
