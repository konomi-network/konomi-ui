import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from 'modules/transactions';
import transactionsActions from 'modules/transactions/actions';

const HIDE_DELAY = 15000;

const useHideTxn = () => {
  const dispatch = useDispatch();
  const { success, failed } = useSelector(getTransactions);

  useEffect(() => {
    let hideSuccessTimeout: NodeJS.Timeout, hideFailedTimeout: NodeJS.Timeout;
    if (success.length) {
      hideSuccessTimeout = setTimeout(
        () => dispatch(transactionsActions.REMOVE_SUCCESS(success)),
        HIDE_DELAY
      );
    }
    if (failed.length) {
      hideFailedTimeout = setTimeout(
        () => dispatch(transactionsActions.REMOVE_FAILED(failed)),
        HIDE_DELAY
      );
    }

    return () => {
      if (hideSuccessTimeout) clearTimeout(hideSuccessTimeout);
      if (hideFailedTimeout) clearTimeout(hideFailedTimeout);
    };
  }, [success, failed, dispatch]);
};

export default useHideTxn;
