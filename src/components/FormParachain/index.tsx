import styles from './index.module.scss';

// TODO: update when integrate with API
type TProps = {
  parachainName?: string;
  connectionUrl?: string;
  feedId?: string;
};

const FormParachain: React.FC<TProps> = ({ parachainName, connectionUrl, feedId }) => {
  return (
    <div className={styles.parachain}>
      <div className={styles.item}>
        <span className={styles.label}>Parachain Name</span>
        <span className={styles.value}>{parachainName}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Parachain Url</span>
        <span className={styles.value}>{connectionUrl}</span>
      </div>
      <div className={styles.item}>
        <span className={styles.label}>Feed ID</span>
        <span className={styles.value}>{feedId}</span>
      </div>
    </div>
  );
};

export default FormParachain;
