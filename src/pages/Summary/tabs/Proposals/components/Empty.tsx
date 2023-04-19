import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSelectedAccount } from 'modules/account/reducer';
import { OracleEmptyIcon } from 'resources/icons';
import useConnectionState from 'hooks/useConnectionState';
import styles from './Empty.module.scss';

type TProps = {
  content?: string;
};

const Empty: React.FC<TProps> = () => {
  const { toggleWalletConnect } = useConnectionState();
  const selectedAccount = useSelector(getSelectedAccount);

  const renderRedirectText = () => {
    if (selectedAccount) {
      return (
        <>
          Click <Link to="/oracle/new-proposal">here</Link> to create a new one
        </>
      );
    }

    return (
      <>
        Please{' '}
        <a href="#" onClick={toggleWalletConnect}>
          connect wallet
        </a>{' '}
        to view proposals
      </>
    );
  };

  return (
    <div className={styles.empty}>
      <OracleEmptyIcon />
      <div className={styles.text}>There is no proposal yet. {renderRedirectText()}</div>
    </div>
  );
};

export default Empty;
