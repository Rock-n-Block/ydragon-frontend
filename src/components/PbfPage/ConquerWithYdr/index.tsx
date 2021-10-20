import React from 'react';

import { JsonAnimation } from '../../index';

import './ConquerWithYdr.scss';

import chipAnim from '../../../assets/json-anim/pbf-chip.json';

import { ReactComponent as ConquerItem1 } from '../../../assets/img/pbf-page/conquer-item-1.svg';

const ConquerWithYdr: React.FC = () => {
  return (
    <section className="conquer section">
      <h2 className="conquer-title text-gradient">CONQUER WITH YDRAGON</h2>
      <div className="conquer-item">
        <div className="conquer-item__inner">
          <div className="conquer-item__img">
            <ConquerItem1 />
          </div>
          <div className="conquer-item__content">
            <h3 className="conquer-item__title text-MER">The Problem</h3>
            <div className="conquer-item__subtitle">
              <p>
                Due to the recent growth spike across a number of blockchains another problem has
                arisen.
              </p>
              <p>
                This spike has created enormous interest across the crypto space around methods to
                invest in newer, incredibly promising blockchains, and right now this is a problem
                with no clear solution.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="conquer-item conquer-item--reverse">
        <div className="conquer-item__inner">
          <div className="conquer-item__content">
            <h3 className="conquer-item__title text-MER">The Solution</h3>
            <div className="conquer-item__subtitle">
              <p>
                The solution is simple — to utilise the YDragon platform to collateralise assets in
                managed vaults with a predetermined mission statement.
              </p>
              <p>
                These vaults and the assets within, will allow us, and you, to gain exposure to
                as-yet-unestablished blockchains currently without the right infrastructure or
                financial ability to be able to build indexes around them.
              </p>
            </div>
          </div>
          <div className="conquer-item__img">
            <JsonAnimation animData={chipAnim} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConquerWithYdr;
