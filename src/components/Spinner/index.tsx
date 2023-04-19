import styles from './index.module.scss';

type TProps = {
  className?: string;
};

const Loader: React.FC<TProps> = ({}) => {
  return (
    <div className={styles.wrapper}>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default Loader;
