import { useDispatch, useSelector } from 'react-redux';
import commonActions from 'modules/common/actions';
import { getSelectedAccount } from 'modules/account/reducer';
import { getNetworkError } from 'modules/common/reducer';

const useConnectionState = () => {
  const dispatch = useDispatch();
  const selectedAccount = useSelector(getSelectedAccount);
  const networkError = useSelector(getNetworkError);

  const toggleWalletConnect = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    dispatch(commonActions.TOGGLE_WALLET_CONNECTOR(true));
  };

  return {
    hasNoConnection: !selectedAccount?.address && !networkError,
    hasNetworkError: !selectedAccount?.address && networkError,
    toggleWalletConnect
  };
};

export default useConnectionState;
