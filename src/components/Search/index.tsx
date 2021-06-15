import React, { ChangeEvent, useState } from 'react';

export interface ISearchToken {
  name: string;
  symbol: string;
  coin_node: string;
  address: string;
  image: string;
}

interface SearchProps {
  data?: Array<ISearchToken>;
  className?: string;
  onChange: (searchString: string) => void;
  onPick: (item: ISearchToken) => void;
}

const Search: React.FC<SearchProps> = ({ data, className, onChange, onPick }) => {
  const [newTokenName, setNewTokenName] = useState<string>('');
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewTokenName(e.target.value);
    onChange(e.target.value);
  };
  return (
    <div className={`search ${className}`}>
      <input
        type="text"
        placeholder="Name token"
        value={newTokenName}
        onChange={(e) => handleChange(e)}
        className="rebalance-add-token__input"
      />
      <ul className="search__items">
        {data?.map((item) => (
          <li className="search__item" key={`search-${item.symbol}`}>
            <div
              role="button"
              onClick={() => onPick(item)}
              onKeyDown={() => onPick(item)}
              tabIndex={0}
              className="search__item-wrapper"
            >
              <img src={item.image} alt={`${item.name} icon`} className="search__icon" />
              <div className="search__name">
                <p className="search__name-full">{item.name}</p>
                <p className="search__name-symbol">{item.symbol}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Search;
