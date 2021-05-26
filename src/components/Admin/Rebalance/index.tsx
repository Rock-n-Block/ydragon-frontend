import React from 'react';

import { Button, GradientText } from '../../index';

import './Rebalance.scss';

const Rebalance: React.FC = () => {
  return (
    <section className="section section--admin">
      <h2 className="section__title">
        <GradientText width="666" height="36" text="Index rebalance" />
      </h2>

      <div className="rebalance-table">
        <div className="rebalance-table__row rebalance-table__row--head">
          <div className="rebalance-table__col">Token</div>
          <div className="rebalance-table__col">
            Quantity <br /> per Index
          </div>
          <div className="rebalance-table__col">Token Price</div>
          <div className="rebalance-table__col">Current Price Allocation</div>
          <div className="rebalance-table__col">
            Total Price <br /> per Index
          </div>
        </div>

        <div className="rebalance-table__content">
          <div className="rebalance-table__row">
            <div className="rebalance-table__col">
              <div className="rebalance-table__token">Token 1</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__quantity">4.9938</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">$30.44</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
          </div>
          <div className="rebalance-table__row">
            <div className="rebalance-table__col">
              <div className="rebalance-table__token">Token 1</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__quantity">4.9938</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">$30.44</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
          </div>
          <div className="rebalance-table__row">
            <div className="rebalance-table__col">
              <div className="rebalance-table__token">Token 1</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__quantity">4.9938</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">$30.44</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
          </div>

          <div className="rebalance-table__btn-row">
            <Button text="rebalance index" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rebalance;
