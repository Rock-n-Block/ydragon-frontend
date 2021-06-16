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
            <img src={icon1} alt="" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Cross-Chain</div>

            <div className="features-item__descr">
              The YDragon protocol allows you to invest in indexes from various blockchains. No more
              hassle switching from one network to another.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <img src={icon2} alt="" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Yield Generation</div>

            <div className="features-item__descr">
              When you lock your funds in an index, you will be entitled to a passive income through
              smart revenue generation. Don&apos;t worry, we take care of everything, whilst you can
              relax and let your money work for you.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <img src={icon3} alt="" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Risk Diversification</div>

            <div className="features-item__descr">
              Everyone knows it, do not put all your eggs in the same basket. That&apos;s why at
              YDragon we decided to create indexes that split the risk into the top performing and
              promising tokens.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <img src={icon4} alt="" width="64" height="64" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Utility & Governance</div>

            <div className="features-item__descr">
              Our YDR token is, among other cool advantages, a utility and governance token. What
              does it mean? You will be able to vote and decide of the future of the YDragon indexes
              & strategies, and earn passive income at the same time.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
