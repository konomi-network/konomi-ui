import { SearchBar, Selector } from 'components';

type TProps = {
  onSearch: (e: React.ChangeEvent<HTMLInputElement>) => {} | void;
  onSortChange: (...args: any) => void;
};
const FilterSection: React.FC<TProps> = ({ onSearch, onSortChange }: TProps) => {
  return (
    <div className="flex mb-8 justify-between items-center">
      <div className="flex items-center gap-4 w-auto md:w-1/2">
        <SearchBar onSearch={onSearch} className="w-1/2" placeholder="Type to search for a ocean" />
        <div className="w-1/3">
          <Selector
            options={[
              { label: 'sort by borrow APY', value: 'minBorrowAPY' },
              { label: 'sort by supply APY', value: 'maxSupplyAPY' },
              { label: 'sort by ocean size', value: 'totalLiquidity' }
            ]}
            onChange={onSortChange}
            placeholder="Sort by"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection;
