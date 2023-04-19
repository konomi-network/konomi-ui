import { OracleEmptyIcon } from 'resources/icons';
import styles from './index.module.scss';

type TProps = {
  icon?: any;
  content?: any;
};

const EmptyData: React.FC<TProps> = ({ icon, content }) => {
  return (
    <div className={styles.empty}>
      {icon || <OracleEmptyIcon />}
      <div className={styles.text}>{content}</div>
    </div>
  );
};

export default EmptyData;
