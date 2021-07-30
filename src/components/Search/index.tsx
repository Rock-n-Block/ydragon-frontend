import React, { ChangeEvent, useEffect, useState } from 'react';
import nextId from 'react-id-generator';

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
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleClear?: () => void;
  onPick: (item: ISearchToken) => void;
  newTokenName?: string;
}

const Search: React.FC<SearchProps> = ({
  data,
  className,
  onChange,
  onPick,
  newTokenName,
  handleClear,
}) => {
  const [tokenList, setTokenList] = useState(data);
  // const [newTokenName, setNewTokenName] = useState<string>('');
  // const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   setNewTokenName(e.target.value);
  //   onChange(e.target.value);
  // };
  // const handleClear = () => {
  //   setNewTokenName('');
  //   onChange('');
  // };
  useEffect(() => {
    setTokenList(data);
  }, [data]);
  return (
    <div className={`search ${className}`}>
      <div className="search__inputs">
        <input
          type="text"
          placeholder="Name token"
          value={newTokenName}
          onChange={(e) => onChange(e)}
          className="search__input"
        />
        {newTokenName ? (
          <Button styledType="clear" className="search__btn-clear" onClick={handleClear}>
            <img src={Clear} alt="clear" width="30" height="30" />
          </Button>
        ) : (
          <></>
        )}
      </div>

      <ul className="search__items">
        {tokenList?.map((item) => (
          <li className="search__item" key={nextId()}>
            <div className="search__item-info">
              <img
                src={item.image}
                alt={`${item.name} icon`}
                className="search__icon"
                width="36"
                height="36"
              />
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
