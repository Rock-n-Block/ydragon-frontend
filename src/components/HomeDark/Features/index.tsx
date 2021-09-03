import React from 'react';

import icon1 from '../../../assets/img/featuring/icon-1.svg';
import icon2 from '../../../assets/img/featuring/icon-2.svg';
import icon3 from '../../../assets/img/featuring/icon-3.svg';
import icon4 from '../../../assets/img/featuring/icon-4.svg';

import './Features.scss';

const Features: React.FC = () => {
  return (
    <section className="section">
      <h2 className="section__title text-outline">features</h2>
      <p className="section__sub-title">meet our key features</p>

      <div className="features">
        <div className="features-item">
          <div className="features-item__icon">
            <img src={icon1} alt="feature" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Cross-Chain</div>

            <div className="features-item__descr">
              The YDragon protocol allows you to invest in indexes from various blockchains.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <img src={icon2} alt="feature" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Yield Generation</div>

            <div className="features-item__descr">
              Lock your funds in one of our index tokens and stake it to automatically receive
              passive income.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <img src={icon3} alt="feature" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Risk Diversification</div>

            <div className="features-item__descr">
              Our indexes split the risk into the top performing and most promising tokens.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <img src={icon4} alt="feature" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Utility & Governance</div>

            <div className="features-item__descr">
              Stake your YDR tokens to receive passive income and have your say by voting on the
              future of YDragon indexes and strategies.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
