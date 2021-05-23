import React from 'react';

import { Button, GradientText } from '../../index';

import './Rebalance.scss';

const Rebalance: React.FC = () => {
  return (
    <section className="section">
      <div className="section__title">
        <GradientText width="660" height="36" text="Index rebalance" />
      </div>

      <div className="rebalance-table">
        <div className="rebalance-table__row rebalance-table__row--head">
          <div className="rebalance-table__col">Index 1</div>
          <div className="rebalance-table__col">Amount</div>
          <div className="rebalance-table__col">Price, USD</div>
          <div className="rebalance-table__col">Weight</div>
          <div className="rebalance-table__col">Amount Price</div>
          <div className="rebalance-table__col">Total tonens</div>
        </div>

        <div className="rebalance-table__content">
          <div className="rebalance-table__row">
            <div className="rebalance-table__col">
              <div className="rebalance-table__token">Token 1</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__amount">4.9938</div>
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
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
          </div>
          <div className="rebalance-table__row">
            <div className="rebalance-table__col">
              <div className="rebalance-table__token">Token 1</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__amount">4.9938</div>
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
            <div className="rebalance-table__col">
              <div className="rebalance-table__price">33</div>
            </div>
          </div>
          <div className="rebalance-table__row">
            <div className="rebalance-table__col">
              <div className="rebalance-table__token">Token 1</div>
            </div>
            <div className="rebalance-table__col">
              <div className="rebalance-table__amount">4.9938</div>
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
