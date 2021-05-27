import React from 'react';

import { Button, GradientText } from '../../index';

import './Structure.scss';

const Structure: React.FC = () => {
  return (
    <section className="section section--admin">
      <h2 className="section__title">
        <GradientText width="652" height="38" text="Vault Structure" />
      </h2>

      <div className="structure">
        <div className="structure__title">index 1</div>

        <div className="structure__content">
          <div className="structure-item">
            <div className="structure-item__info">
              <div className="structure-item__icon"> </div>
              <div className="structure-item__name">X Vault</div>
            </div>

            <div className="structure-item__value">3.000</div>

            <Button
              styledType="outline"
              colorScheme="orange"
              background="white"
              borderSize="sm"
              className="structure-item__pause"
            >
              Pause
            </Button>
          </div>
          <div className="structure-item">
            <div className="structure-item__info">
              <div className="structure-item__icon"> </div>
              <div className="structure-item__name">Y Vault</div>
            </div>

            <div className="structure-item__value">3.000</div>

            <Button
              styledType="outline"
              colorScheme="orange"
              background="white"
              borderSize="sm"
              className="structure-item__pause"
            >
              Pause
            </Button>
          </div>
          <div className="structure-item">
            <div className="structure-item__info">
              <div className="structure-item__icon"> </div>
              <div className="structure-item__name">Z Vault</div>
            </div>

            <div className="structure-item__value">3.000</div>

            <Button
              styledType="outline"
              colorScheme="orange"
              background="white"
              borderSize="sm"
              className="structure-item__pause"
            >
              Pause
            </Button>
          </div>
        </div>

        <div className="structure__btn-row">
          <Button>rebalance XY structure</Button>
        </div>
      </div>
    </section>
  );
};

export default Structure;
