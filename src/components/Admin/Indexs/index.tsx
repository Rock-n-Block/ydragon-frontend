import React from 'react';

import { Button, GradientText } from '../../index';

import './Indexs.scss';

const Indexs: React.FC = () => {
  return (
    <section className="section section--admin">
      <div className="section__title-row">
        <h2 className="section__title">
          <GradientText width="256" height="38" text="Indexs" />
        </h2>

        <Button className="index-create-btn">create new index</Button>
      </div>

      <div className="indexs-table">
        <div className="indexs-table__row indexs-table__row--head">
          <div className="indexs-table__col">
            <div className="indexs-table__sort indexs-table__sort--up">Name</div>
          </div>
          <div className="indexs-table__col">
            <div className="indexs-table__sort">Market cap</div>
          </div>
          <div className="indexs-table__col">
            <div className="indexs-table__sort">Price</div>
          </div>
          <div className="indexs-table__col">
            <div className="indexs-table__sort">Cteated</div>
          </div>
        </div>

        <div className="indexs-table__content">
          <div className="indexs-table__row">
            <div className="indexs-table__col">
              <div className="indexs-table__name">ETH BT FarmST</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__market-cup">4.9938</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__price">$375</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__created">20.04.2021</div>
            </div>
          </div>
          <div className="indexs-table__row">
            <div className="indexs-table__col">
              <div className="indexs-table__name">ETH BT FarmST</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__market-cup">4.9938</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__price">$375</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__created">20.04.2021</div>
            </div>
          </div>
          <div className="indexs-table__row">
            <div className="indexs-table__col">
              <div className="indexs-table__name">ETH BT FarmST</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__market-cup">4.9938</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__price">$375</div>
            </div>
            <div className="indexs-table__col">
              <div className="indexs-table__created">20.04.2021</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Indexs;
