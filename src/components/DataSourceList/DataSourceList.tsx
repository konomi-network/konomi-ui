import { useSelector } from 'react-redux';
import cx from 'classnames';
import { TokenIcon, Antd } from 'components';
import { getDataSourceMap } from 'modules/common/reducer';
import { displayAddress } from 'utils/formatter';
import { IProposalDataSource } from 'types/oracleProposal';

import styles from './DataSourceList.module.scss';

type TProps = {
  error?: boolean;
  sources: IProposalDataSource[] | undefined;
};

const DataSourceList: React.FC<TProps> = ({ sources, error }) => {
  const dataSourceMap = useSelector(getDataSourceMap);
  return (
    <div
      className={cx(
        styles.dataSourceList,
        'flex flex-col justify-start text-white overflow-y-scroll'
      )}>
      <Antd.Skeleton
        className={cx(styles.skeleton, 'flex items-center h-6')}
        paragraph={false}
        loading={!sources && !error}
        active>
        {sources?.map((i) => (
          <div className={cx(styles.sourceItem, 'flex justify-between items-center')} key={i.type}>
            <TokenIcon
              size={24}
              borderWidth={0}
              withBackground={false}
              className="justify-start"
              name={dataSourceMap[i.type]}
              showName
            />
            <Antd.Tooltip title={i.detail.address} className="underline">
              {i.detail.coinId || displayAddress(i.detail.address)}
            </Antd.Tooltip>
          </div>
        )) || 'Not found'}
      </Antd.Skeleton>
    </div>
  );
};

export default DataSourceList;
