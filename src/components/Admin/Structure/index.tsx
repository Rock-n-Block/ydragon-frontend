import React from 'react';

import { Button, GradientText } from '../../index';

import './Structure.scss';

const Structure: React.FC = () => {
  return (
    <section className="section section--admin">
      <div className="section__title">
        <GradientText width="660" height="36" text="Vault Structure" />
      </div>

      <div className="structure">
        <div className="structure__title">index 1</div>

        <div className="structure__content">
          <div className="structure-item">
            <div className="structure-item__info">
              <div className="structure-item__icon"> </div>
              <div className="structure-item__name">X Vault</div>
            </div>

            <div className="structure-item__value">3.000</div>

            <div className="structure-item__pause">Pause</div>
          </div>
          <div className="structure-item">
            <div className="structure-item__info">
              <div className="structure-item__icon"> </div>
              <div className="structure-item__name">Y Vault</div>
            </div>

            <div className="structure-item__value">3.000</div>

            <div className="structure-item__pause">Pause</div>
          </div>
          <div className="structure-item">
            <div className="structure-item__info">
              <div className="structure-item__icon"> </div>
              <div className="structure-item__name">Z Vault</div>
            </div>

            <div className="structure-item__value">3.000</div>

            <div className="structure-item__pause">Pause</div>
          </div>
        </div>

        <div className="structure__btn-row">
          <Button text="rebalance XY structure" />
        </div>
      </div>
    </section>
  );
};

export default Structure;
