import cx from 'classnames';
import { SearchBar } from 'components';
import styles from './FilterSection.module.scss';

type TProps = {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => {} | void;
};
const FilterSection: React.FC<TProps> = ({ onSearch }: TProps) => {
  return (
    <div className={cx(styles.filter, 'mb-8')}>
      <SearchBar onSearch={onSearch} />
    </div>
  );
};

export default FilterSection;
