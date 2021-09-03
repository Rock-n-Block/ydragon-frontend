import React from 'react';

import './Advantages.scss';

const Advantages: React.FC = () => {
  return (
    <section className="section">
      <div className="section__title-row">
        <h2 className="section__title text-outline">DEFI</h2>
        <div className="section__sub-title">RIGHT NOW</div>
      </div>

      <div className="advantages-row">
        <div className="advantages">
          <div className="advantages__item">
            <div className="advantages__item-title">High Cost</div>
            <div className="advantages__item-descr">Multiple high cost fees to own assets</div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">Time consuming</div>
            <div className="advantages__item-descr">
              Building a diversified portfolio requires many transactions to create
            </div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">Complex portfolio management</div>
            <div className="advantages__item-descr">
              Users need to move across chains to buy assets, making it difficult to monitor your
              portfolio
            </div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">Technically difficult</div>
            <div className="advantages__item-descr">
              DeFI is complicated to navigate, understand, and is not user friendly
            </div>
          </div>

          <div className="advantages__item">
            <div className="advantages__item-title">High risk</div>
            <div className="advantages__item-descr">High volatility owning individual assets</div>
          </div>
        </div>

        <div className="advantages-yd">
          <div className="advantages-yd__title">with ydragon</div>

          <div className="advantages advantages--yd">
            <div className="advantages__item">
              <div className="advantages-yd__item-title">Reduced costs</div>
              <div className="advantages-yd__item-descr">
                One-time investment to own a diversified portfolio
              </div>
            </div>

            <div className="advantages__item">
              <div className="advantages-yd__item-title">Time saving</div>
              <div className="advantages-yd__item-descr">
                Less transactions needed to build <br /> your portfolio
              </div>
            </div>

            <div className="advantages__item">
              <div className="advantages-yd__item-title">Simplified portfolio management</div>
              <div className="advantages-yd__item-descr">
                Indexes are cross chain and held in one place for ease of tracking
              </div>
            </div>

            <div className="advantages__item">
              <div className="advantages-yd__item-title">Easy to use</div>
              <div className="advantages-yd__item-descr">Simple and easy to use platform</div>
            </div>

            <div className="advantages__item">
              <div className="advantages-yd__item-title">Risk Diversification</div>
              <div className="advantages-yd__item-descr">
                Basket of funds improves risk strategy
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
