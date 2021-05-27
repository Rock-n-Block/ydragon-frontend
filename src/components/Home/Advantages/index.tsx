import React from 'react';

import { GradientText } from '../../index';

import './Advantages.scss';

const Advantages: React.FC = () => {
  return (
    <section className="section">
      <div className="section__title-row">
        <h2 className="section__title">
          <GradientText width="146" height="38" text="DEFI" />
        </h2>
        <div className="section__sub-title">RIGHT NOW</div>
      </div>

      <div className="advantages-row">
        <div className="advantages">
          <div className="advantages__item">
            <div className="advantages__item-title">Use only ETH/DAI</div>
            <div className="advantages__item-descr">Huge fees 10$+ for one Tx</div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">Difficult to use</div>
            <div className="advantages__item-descr">Lower ROI</div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">Over 50 liquidity pools</div>
            <div className="advantages__item-descr">Hard to navigate</div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">Difficult to understand economics</div>
            <div className="advantages__item-descr">
              Incentive and governance tokens with high volatility
            </div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">Maintainance cost</div>
          </div>
        </div>

        <div className="advantages-yd">
          <div className="advantages-yd__title">with ydragon</div>

          <div className="advantages advantages--yd">
            <div className="advantages__item">
              <div className="advantages__item-title">Use BTC and other crypto</div>
              <div className="advantages__item-descr">BTC, TRX, XRP and many more</div>
            </div>

            <div className="advantages__item">
              <div className="advantages__item-title">Easy to use</div>
              <div className="advantages__item-descr">Higher ROI</div>
            </div>

            <div className="advantages__item">
              <div className="advantages__item-title">No maintainance fees</div>
              <div className="advantages__item-descr">
                We’ve created YD Machines for easy to use liquidity sharing and Yield Farming
              </div>
            </div>

            <div className="advantages__item">
              <div className="advantages__item-title">Easy to understand</div>
            </div>

            <div className="advantages__item">
              <div className="advantages__item-title">Automatic pool selection</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
