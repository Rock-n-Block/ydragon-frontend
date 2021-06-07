import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../../store/store';
import { Button, GradientText } from '../../index';

import './Rebalance.scss';

const Rebalance: React.FC = observer(() => {
  const { modals } = useMst();
  const handleRebalanceOpen = () => {
    console.log(handleRebalanceOpen);
    modals.rebalance.open();
  };
  return (
    <section className="section section--admin">
      <h2 className="section__title">
        <GradientText width="648" height="38" text="Index rebalance" />
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
            <Button onClick={handleRebalanceOpen}>rebalance index</Button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Rebalance;
