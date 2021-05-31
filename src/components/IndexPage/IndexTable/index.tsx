import React from 'react';
import BigNumber from 'bignumber.js/bignumber';

import './IndexTable.scss';

export interface IToken {
  address: string;
  count: string;
  current_weight: number;
  decimal: number;
  id: number;
  name: string;
  price_for_one: number;
  price_total: number;
  symbol: string;
  unit_weight: number;
}
interface IndexTableProps {
  tokens: Array<IToken> | undefined;
}
const IndexTable: React.FC<IndexTableProps> = ({ tokens }) => {
  return (
    <div className="index-table">
      <div className="index-table__row index-table__row--head">
        <div className="index-table__col">Token</div>
        <div className="index-table__col">
          Quantity <br /> per Set
        </div>
        <div className="index-table__col">Token Price</div>
        <div className="index-table__col">Current Weight</div>
        {/* <div className="index-table__col">Percent Change</div> */}
        <div className="index-table__col">
          Total Price <br /> per Set
        </div>
      </div>

      <div className="index-table__content">
        {tokens ? (
          tokens.map((token) => (
            <div className="index-table__row" key={`token-${token.id}`}>
              <div className="index-table__col">
                <div className="index-table__token">{token.name}</div>
              </div>
              <div className="index-table__col">
                <div className="index-table__quantity">
                  {new BigNumber(token.count)
                    .multipliedBy(new BigNumber(10).pow(-token.decimal))
                    .toFixed(2)}
                </div>
              </div>
              <div className="index-table__col">
                {/* TODO: add data from backend */}
                <div className="index-table__price">${token.price_for_one}</div>
              </div>
              <div className="index-table__col">
                <div className="index-table__price">
                  {new BigNumber(token.current_weight).multipliedBy(100).toFixed(2)}%
                </div>
              </div>
              <div className="index-table__col">
                <div className="index-table__price">${token.price_total}</div>
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
