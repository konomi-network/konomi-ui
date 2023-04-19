import { useDispatch, useSelector } from 'react-redux';
import cx from 'classnames';
import LoadingOutlined from '@ant-design/icons/LoadingOutlined';
import { Antd } from 'components';
import transactionsActions from 'modules/transactions/actions';
import { getTransactions } from 'modules/transactions';
import { getCurrentNetworkId } from 'modules/connection/reducer';
import { ReactComponent as ViewIcon } from './images/view.svg';
import useHideTxn from './hooks/useHideTxn';
import styles from './GlobalTransactions.module.scss';
import useExplorerUrls from 'hooks/useExplorerUrls';

type TProps = {};

const GlobalTransactions: React.FC<TProps> = () => {
  const dispatch = useDispatch();
  const networkId = useSelector(getCurrentNetworkId);
  const { pending, success, failed } = useSelector(getTransactions);
  const showViewDetail = networkId !== undefined && (!!failed.length || !!success.length);
  const { getTransactionUrl } = useExplorerUrls();
  useHideTxn();

  const renderStatusIcon = () => {
    if (pending.length) {
      return <Antd.Spin className={styles.loader} indicator={<LoadingOutlined spin />} />;
    }
    if (failed.length) {
      return null;
    }
    return <span className={styles.done}></span>;
  };

  const renderStatusText = () => {
    if (pending.length) {
      return `${pending.length} Transaction(s) in Progress`;
    }
    if (failed.length) {
      return `${failed.length} Transaction(s) Failed`;
    }
    return `${success.length} Transaction(s) Completed `;
  };

  const handleViewing = () => {
    dispatch(transactionsActions.REMOVE_FAILED(failed[failed.length - 1]));
    dispatch(transactionsActions.REMOVE_SUCCESS(success[success.length - 1]));
  };

  if (!pending.length && !success.length && !failed.length) return null;

  return (
    <div className={cx(styles.wrapper, { [styles.fail]: !!failed.length })}>
      <span className="w-5 h-5 mr-2 flex">{renderStatusIcon()}</span>
      <span className="text-xs">{renderStatusText()}</span>
      {showViewDetail && (
        <a
          rel="noreferrer"
          target="_blank"
          onClick={handleViewing}
          href={getTransactionUrl(failed[failed.length - 1] || success[success.length - 1])}
          className={styles.viewIcon}>
          <ViewIcon />
        </a>
      )}
    </div>
  );
};
export default GlobalTransactions;
