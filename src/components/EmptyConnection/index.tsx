import { ConnectionEmptyIcon } from 'resources/icons';
import useConnectionState from 'hooks/useConnectionState';
import styles from './index.module.scss';

type TProps = {
  content?: string;
};

const EmptyConnection: React.FC<TProps> = ({ content }) => {
  const { toggleWalletConnect } = useConnectionState();

  return (
    <div className={styles.empty}>
      <ConnectionEmptyIcon className="mx-auto my-0" />
      <div className="mt-6 text-white text-lg">
        Please{' '}
        <a
          href="#"
          onClick={toggleWalletConnect}
          className="pb-0.5 font-semibold text-primary border-b-2 border-solid border-b-primary">
          connect wallet
        </a>{' '}
        to {content || 'view your subscription'}
      </div>
    </div>
  );
};

export default EmptyConnection;
