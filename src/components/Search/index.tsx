import React, { ChangeEvent, useState } from 'react';

import Clear from '../../assets/img/icons/icon-close-red.svg';
import { ReactComponent as GreenPlus } from '../../assets/img/icons/icon-plus-green.svg';
import { Button } from '../index';

import './Search.scss';

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
  const handleClear = () => {
    setNewTokenName('');
    onChange('');
  };
  return (
    <div className={`search ${className}`}>
      <div className="search__inputs">
        <input
          type="text"
          placeholder="Name token"
          value={newTokenName}
          onChange={(e) => handleChange(e)}
          className="search__input"
        />
        {!newTokenName ? (
          <Button styledType="outline" colorScheme="green" className="search__btn">
            <GreenPlus />
            Add Token
          </Button>
        ) : (
          <Button styledType="clear" className="search__btn-clear" onClick={handleClear}>
            <img src={Clear} alt="clear" />
          </Button>
        )}
      </div>

      <ul className="search__items">
        {data?.map((item) => (
          <li className="search__item" key={`search-${item.symbol}`}>
            <div className="search__item-info">
              <img src={item.image} alt={`${item.name} icon`} className="search__icon" />
              <div className="search__name">
                <p className="search__name-full">{item.name}</p>
                <p className="search__name-symbol">{item.symbol}</p>
              </div>
            </div>
            <Button
              styledType="outline"
              colorScheme="green"
              className="search__btn"
              onClick={() => onPick(item)}
            >
              <GreenPlus />
              Add Token
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Search;
