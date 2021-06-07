import React from 'react';
import BigNumber from 'bignumber.js/bignumber';

import './IndexTable.scss';

export interface IToken {
  address: string;
  count: number;
  current_weight: number;
  decimal: number;
  id: number;
  name: string;
  price: number;
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
                <div className="index-table__quantity">{token.count}</div>
              </div>
              <div className="index-table__col">
                {/* TODO: add data from backend */}
                <div className="index-table__price">${token.price}</div>
              </div>
              <div className="index-table__col">
                <div className="index-table__price">{token.current_weight}%</div>
              </div>
              <div className="index-table__col">
                <div className="index-table__price">
                  $
                  {new BigNumber(token.price)
                    .multipliedBy(token.current_weight)
                    .dividedBy(100)
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
