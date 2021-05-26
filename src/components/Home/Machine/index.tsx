import React from 'react';

import icon1 from '../../../assets/img/featuring/icon-1.svg';
import icon2 from '../../../assets/img/featuring/icon-2.svg';
import icon3 from '../../../assets/img/featuring/icon-3.svg';
import icon4 from '../../../assets/img/featuring/icon-4.svg';
import image from '../../../assets/img/machine.svg';
import { GradientText } from '../../index';

import './Machine.scss';

const Machine: React.FC = () => {
  return (
    <section className="section machine">
      <h2 className="section__title">
        <GradientText width="664" height="36" text="YDragon Machine" />
      </h2>
      <span className="section__sub-title">Our core platform product</span>

      <div className="section__text-row">
        <p className="section__text">
          We’ve created it specifically to make the process of Yield Farming as easy as possible.
          Through providing the needed tools for the mass market to use DeFi we strive to bring new
          innovation and more liquidity to the DeFi world. We are committed to creating more
          products that allow for a wider range of users to access DeFi at the same time education
          our users about it
        </p>
      </div>

      <div className="machine__img">
        <img src={image} alt="" width="686" height="502" />
      </div>

      <div className="machine-featuring">
        <h3 className="machine-featuring__title">featuring</h3>

        <div className="machine-featuring__row">
          <div className="machine-featuring__item">
            <div className="machine-featuring__item-icon">
              <img src={icon1} alt="" width="64" height="64" />
            </div>
            <div className="machine-featuring__item-text">
              By buying a YD Machine you are basically providing liquidity to DeFi protocols for a
              limited amount of time. At the end of the period you get back all the money you paid
              for the YD Maching + what you’ve earned through Yield Farming.{' '}
            </div>
          </div>

          <div className="machine-featuring__item">
            <div className="machine-featuring__item-icon">
              <img src={icon2} alt="" width="64" height="64" />
            </div>
            <div className="machine-featuring__item-text">
              You can buy the YD Machine with one of many cryptocurrencies available on the platform
              - after that its pegged to USDT . The YD Machine automatically ﬁnds the best Yield
              generating pools and works on maintaining highest possible yields. We are expecting
              returns of 5-20+% return monthly till end of November, then it will go down as the
              DeFi space get more liquidity.
            </div>
          </div>

          <div className="machine-featuring__item">
            <div className="machine-featuring__item-icon">
              <img src={icon3} alt="" width="64" height="64" />
            </div>
            <div className="machine-featuring__item-text">
              You can withdraw your earned funds weekly our choose to restate them thus gaining a
              complex % return on the Yield Farming.
            </div>
          </div>

          <div className="machine-featuring__item">
            <div className="machine-featuring__item-icon">
              <img src={icon4} alt="" width="64" height="64" />
            </div>
            <div className="machine-featuring__item-text">
              YD Machine take only 5% off of the Net Return. This mainly covers our network fees.
              And will be switched to 25% in Q4 of 2020.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Machine;
