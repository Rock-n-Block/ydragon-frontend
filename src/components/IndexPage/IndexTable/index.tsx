import React from 'react';
import BigNumber from 'bignumber.js/bignumber';

import './IndexTable.scss';
import arrowUp from '../../../assets/img/chart/arrow-up.svg';
import arrowDown from '../../../assets/img/chart/arrow-down.svg';

export interface IToken {
  address: string;
  count: string;
  current_weight: number;
  decimal: number;
  id: number;
  image: string;
  name: string;
  price_for_one: number;
  price_total: number;
  symbol: string;
  unit_weight: number;
  percent_change: number;
}

export interface IHistoricalToken {
  percent_change: number;
  rate: string;
  repr_count: string;
  token_image: string;
  token_name: string;
  total_price: string;
  weight: string;
}

interface IndexTableProps {
  tokens: Array<IHistoricalToken> | Array<IToken> | undefined;
}

const IndexTable: React.FC<IndexTableProps> = ({ tokens }) => {
  return (
    <div className="index-table">
      <div className="index-table__row index-table__row--head">
        <div className="index-table__col">Token</div>
        <div className="index-table__col">
          Quantity <br /> in Index
        </div>
        <div className="index-table__col">Token Price</div>
        <div className="index-table__col">Current Weight</div>
        <div className="index-table__col">Percent Change</div>
        <div className="index-table__col">
          Total Price <br /> per Set
        </div>
      </div>

      <div className="index-table__content">
        {tokens ? (
          tokens.map((token: IToken | IHistoricalToken) => (
            <div
              className="index-table__row"
              key={`token-${'id' in token ? token.id : token.token_name}`}
            >
              <div className="index-table__col index-table__first-col">
                <img
                  src={'image' in token ? token.image : token.token_image}
                  className="index-table__image"
                  alt={`${'name' in token ? token.name : token.token_name} logo`}
                  width="31"
                  height="31"
                />
                <div className="index-table__token">
                  {'name' in token ? token.name : token.token_name}
                </div>
              </div>
              <div className="index-table__col">
                <div className="index-table__quantity">
                  {new BigNumber('count' in token ? token.count : token.repr_count)
                    .multipliedBy(new BigNumber(10).pow('decimal' in token ? -token.decimal : 0))
                    .toFixed(4)}
                </div>
              </div>
              <div className="index-table__col">
                <div className="index-table__price">
                  ${'price_for_one' in token ? token.price_for_one : token.rate}
                </div>
              </div>
              <div className="index-table__col">
                <div className="index-table__price">
                  {`${new BigNumber('current_weight' in token ? token.current_weight : token.weight)
                    .multipliedBy(100)
                    .toFixed(2)}%`}
                </div>
              </div>
              <div className="index-table__col">
                <div className="index-table__diff">
                  <div
                    className={`index-table__diff-${
                      'percent_change' in token && +token?.percent_change < 0 ? 'down' : 'up'
                    }`}
                  >
                    {'percent_change' in token && +token?.percent_change < 0 ? (
                      <img src={arrowDown} alt="arrow down" width="10" height="10" />
                    ) : (
                      <img src={arrowUp} alt="arrow up" width="10" height="10" />
                    )}
                    {new BigNumber(
                      'percent_change' in token && token.percent_change ? token.percent_change : 0,
                    ).toFixed(2)}{' '}
                    %
                  </div>
                </div>
              </div>
              <div className="index-table__col">
                <div className="index-table__price">
                  $
                  {new BigNumber('price_total' in token ? token.price_total : token.total_price)
                    .multipliedBy('price_total' in token ? 1 : 100)
                    .toFixed(2)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default IndexTable;
