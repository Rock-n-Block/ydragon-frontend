import React from 'react';

import './Table.scss';

const Table: React.FC = () => {
  return (
    <div className="index-table">
      <div className="index-table__row index-table__row--head">
        <div className="index-table__col">Token</div>
        <div className="index-table__col">
          Quantity <br /> per Set
        </div>
        <div className="index-table__col">Token Price</div>
        <div className="index-table__col">Current Price Allocation</div>
        <div className="index-table__col">Percent Change</div>
        <div className="index-table__col">
          Total Price <br /> per Set
        </div>
      </div>

      <div className="index-table__content">
        <div className="index-table__row">
          <div className="index-table__col">
            <div className="index-table__token">Synthetix Network Token</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__quantity">4.9938</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$30.44</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$26.77</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__percent-change index-table__percent-change--up">
              +0.08%
            </div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$444.56</div>
          </div>
        </div>

        <div className="index-table__row">
          <div className="index-table__col">
            <div className="index-table__token">Synthetix Network Token</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__quantity">4.9938</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$30.44</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$26.77</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__percent-change index-table__percent-change--up">
              +0.08%
            </div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$444.56</div>
          </div>
        </div>

        <div className="index-table__row">
          <div className="index-table__col">
            <div className="index-table__token">Synthetix Network Token</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__quantity">4.9938</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$30.44</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$26.77</div>
          </div>
          <div className="index-table__col">
            <div className="index-table__percent-change index-table__percent-change--down">
              -0.08%
            </div>
          </div>
          <div className="index-table__col">
            <div className="index-table__price">$444.56</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
