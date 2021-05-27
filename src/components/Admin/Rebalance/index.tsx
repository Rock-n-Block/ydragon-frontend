import React from 'react';

import { Button, GradientText } from '../../index';

import './Rebalance.scss';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';

const Rebalance: React.FC = observer(() => {
  const {modals}=useMst();
  const handleRebalanceOpen=()=>{
    console.log(handleRebalanceOpen)
    modals.rebalance.open();
  }
  return (
    <section className="section section--admin">
      <div className="section__title">
        <GradientText width="666" height="36" text="Index rebalance" />
      </div>

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
            <Button onClick={handleRebalanceOpen}>rebalance index</Button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Rebalance;
