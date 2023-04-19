import React from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import SearchOutlined from '@ant-design/icons/SearchOutlined';
import { Antd } from 'components';

import styles from './SearchBar.module.scss';

type TProps = {
  onSearch: (...args: any) => any;
  debounceTimer?: number;
  size?: SizeType;
  style?: Object;
  placeholder?: string;
  className?: string;
};

const SearchBar: React.FC<TProps> = ({
  onSearch,
  debounceTimer = 300,
  size = 'large',
  style = {},
  placeholder = 'Type to search for tokens',
  className
}: TProps) => {
  return (
    <div className={cx(styles.searchBar, className)} style={style}>
      <Antd.Input
        className={styles.searchInput}
        placeholder={placeholder}
        suffix={<SearchOutlined className={styles.searchIcon} />}
        size={size}
        allowClear
        onChange={debounce(onSearch, debounceTimer)}
      />
    </div>
  );
};

export default SearchBar;
