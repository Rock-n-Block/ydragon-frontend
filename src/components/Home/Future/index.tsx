import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import img1 from '../../../assets/img/future/icon-1.svg';
import img2 from '../../../assets/img/future/icon-2.svg';
import slide1 from '../../../assets/img/partners/logo-1.png';
import slide2 from '../../../assets/img/partners/logo-2.png';
import slide3 from '../../../assets/img/partners/logo-3.png';
import slide4 from '../../../assets/img/partners/logo-4.png';
import slide5 from '../../../assets/img/partners/logo-5.png';
import slide6 from '../../../assets/img/partners/logo-6.png';
import slide7 from '../../../assets/img/partners/logo-7.png';
import slide8 from '../../../assets/img/partners/logo-8.png';
import slide9 from '../../../assets/img/partners/logo-9.png';
import slide10 from '../../../assets/img/partners/logo-10.png';
import { GradientText } from '../../index';

import 'swiper/swiper.scss';
import './Future.scss';

const Future: React.FC = () => {
  const partners = [
    slide1,
    slide2,
    slide3,
    slide4,
    slide5,
    slide6,
    slide7,
    slide8,
    slide9,
    slide10,
  ];

  return (
    <section className="section future">
      <h2 className="section__title">
        <GradientText width="706" height="36" text="The Future of DeFi" />
      </h2>
      <span className="section__sub-title">with YDragon</span>

      <div className="section__text-row">
        <p className="section__text">
          There is a liquidity battle happening between DeFi protocols and their existing tokens
          only lead to more volatility, they value exchange volumes and locked assets the most. We
          value the user - by providing YDragon products allowing for easy access we aim at
          maximising the possibilities of users. After the dust settles the platforms with the
          largest userbase will win.
        </p>
        <p className="section__text">
          We stand by this. In the last 6 months with funding from 2 VCs we have established that we
          will grow by giving towards our community, part of our funding will go towards special
          promotions. <br /> <br /> That is why we created 2 large programs for YD Machine holders.
        </p>
      </div>

      <div className="future__row">
        <div className="future-item">
          <div className="future-item__img">
            <img src={img1} alt="" width="216" height="217" />
          </div>
          <h4 className="future-item__title">DRAGON DROP</h4>
          <p className="future-item__descr">
            Every week we will be distributing a number of DeFi tokens to YD Machine holders. These
            will be large allocations that will allow most early supporters to receive good returns.
            This will also push for more adoption as holders will research more DeFi projects and
            educate themselves.{' '}
          </p>
        </div>

        <div className="future-item">
          <div className="future-item__img">
            <img src={img2} alt="" width="175" height="197" />
          </div>
          <h4 className="future-item__title">YD Tokens</h4>
          <p className="future-item__descr">
            Total supply and hardcap - 20 000 Tokens. 80% tokens airdrop to YD Machine holders and
            early adopters. YDM will be the governance token of YDragon, the community will be able
            to decide on pools allocations, Dragon Drop incentives, support of new DeFi products
            built It will also provide incentives for growth and marketing.
          </p>

          <a href="/" className="future-item__link">
            Learn more -
          </a>
        </div>
      </div>

      <div className="protocols-used">
        <h3 className="protocols-used__title">protocols used</h3>

        <div className="protocols-used__row">
          <Swiper spaceBetween={60} slidesPerView={8} loop>
            {partners.map((partner) => (
              <SwiperSlide>
                <img src={partner} alt="" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Future;
