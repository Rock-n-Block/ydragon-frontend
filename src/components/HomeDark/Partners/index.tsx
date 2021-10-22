import React, { useCallback } from 'react';
import nextId from 'react-id-generator';
import { observer } from 'mobx-react';
import SwiperCore, { Autoplay } from 'swiper/core';
import { Swiper, SwiperSlide } from 'swiper/react';

import bscPad from '../../../assets/img/icons/partners/bsc-pad.svg';
import hyperconnectD from '../../../assets/img/icons/partners/hyperconnect-dark.svg';
import hyperconnectL from '../../../assets/img/icons/partners/hyperconnect-light.svg';
import lossLessD from '../../../assets/img/icons/partners/lossless-dark.svg';
import lossLessL from '../../../assets/img/icons/partners/lossless-light.svg';
import magnusD from '../../../assets/img/icons/partners/magnus-dark.png';
import magnusL from '../../../assets/img/icons/partners/magnus-light.png';
import marshlandD from '../../../assets/img/icons/partners/marshland-dark.png';
import marshlandL from '../../../assets/img/icons/partners/marshland-light.png';
import moonwolfD from '../../../assets/img/icons/partners/moonwolf-dark.png';
import moonwolfL from '../../../assets/img/icons/partners/moonwolf-light.png';
import bscStationL from '../../../assets/img/icons/partners/bsc-station-light.png';
import bscStationD from '../../../assets/img/icons/partners/bsc-station-dark.png';
import polygonD from '../../../assets/img/icons/partners/polygon-dark.svg';
import polygonL from '../../../assets/img/icons/partners/polygon-light.svg';
import qiDaoD from '../../../assets/img/icons/partners/qi-dao-dark.png';
import mateLD from '../../../assets/img/icons/partners/mate-dark.png';
import drakuruLD from '../../../assets/img/icons/partners/drakuru-dark.png';
import qiDaoL from '../../../assets/img/icons/partners/qi-dao-light.png';
import trustSwapD from '../../../assets/img/icons/partners/trust-swap-dark.svg';
import unimexD from '../../../assets/img/icons/partners/unimex-light.svg';
import unimexL from '../../../assets/img/icons/partners/unimex-dark.svg';
import trustSwapL from '../../../assets/img/icons/partners/trust-swap-light.svg';
import cyberfiL from '../../../assets/img/icons/partners/cyberfi-dark.svg';
import cyberfiD from '../../../assets/img/icons/partners/cyberfi-light.svg';
import apeswapLD from '../../../assets/img/icons/partners/apeswap-dark.svg';
import certikD from '../../../assets/img/icons/partners/certik-dark.png';
import certikL from '../../../assets/img/icons/partners/certik-light.png';
import { useMst } from '../../../store/store';

import 'swiper/swiper.scss';
import './Protocols.scss';

SwiperCore.use([Autoplay]);

const Partners: React.FC = observer(() => {
  const { theme } = useMst();
  const partners = useCallback(() => {
    const isLight = theme.value !== 'dark';
    return [
      <a href="https://moonwolf.io/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? moonwolfL : moonwolfD} alt="moonwolf" width="275" height="72" />
      </a>,
      <a
        href="https://unimex.network/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? unimexL : unimexD} alt="unimex logo" width="239" height="64" />
      </a>,
      <a
        href="https://www.certik.org/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? certikL : certikD} alt="certik logo" width="311" height="73" />
      </a>,
      <a
        href="https://apeswap.finance/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? apeswapLD : apeswapLD} alt="apeswap logo" width="311" height="84" />
      </a>,
      <a href="https://orakuru.io/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? drakuruLD : drakuruLD} alt="orakuru logo" width="118" height="118" />
      </a>,
      <a
        href="https://samurai.cyberfi.tech/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? cyberfiL : cyberfiD} alt="cyberfi logo" width="283" height="77" />
      </a>,
      <a href="https://usemate.com/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? mateLD : mateLD} alt="mate logo" width="183" height="51" />
      </a>,
      <a
        href="https://bscstation.finance/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img
          src={isLight ? bscStationL : bscStationD}
          alt="bscStation logo"
          width="186"
          height="72"
        />
      </a>,
      <a
        href="https://www.marshlandcapital.com/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? marshlandL : marshlandD} alt="marshland" width="92" height="78" />
      </a>,
      <a href="https://lossless.cash/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? lossLessL : lossLessD} alt="lossLess" width="291" height="64" />
      </a>,
      <a
        href="https://magnusdigitalassets.com/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? magnusL : magnusD} alt="magnus capital" width="154" height="78" />
      </a>,
      <a
        href="https://polygon.technology/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? polygonL : polygonD} alt="polygon" width="280" height="62" />
      </a>,
      <a href="https://bscpad.com/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={bscPad} alt="bscPad" width="152" height="64" />
      </a>,
      <a
        href="https://www.iconhyperconnect.com/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img
          src={isLight ? hyperconnectL : hyperconnectD}
          alt="icon hyperconnect p-rep"
          width="290"
          height="64"
        />
      </a>,
      <a
        href="https://www.mai.finance/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? qiDaoL : qiDaoD} alt="Qi Dao" width="160" height="72" />
      </a>,
      <a
        href="https://www.trustswap.org/"
        target="_blank"
        className="protocols__link"
        rel="noreferrer"
      >
        <img src={isLight ? trustSwapL : trustSwapD} alt="trustSwap" width="312" height="52" />
      </a>,
    ];
  }, [theme.value]);

  return (
    <section className="section">
      <h3 className="section__title text-outline">Our partners</h3>
      <div className="protocols">
        <div className="protocols__row">
          <Swiper
            slidesPerView={1}
            freeMode
            loop
            allowTouchMove={false}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
            }}
            speed={10000}
            breakpoints={{
              1200: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              576: {
                slidesPerView: 1,
              },
            }}
          >
            {partners().map((partner) => (
              <SwiperSlide key={nextId()} className="protocols__item">
                {partner}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        <div className="protocols__row">
          <Swiper
            slidesPerView={1}
            freeMode
            loop
            allowTouchMove={false}
            autoplay={{
              delay: 0,
              reverseDirection: true,
              disableOnInteraction: false,
            }}
            speed={10000}
            breakpoints={{
              1200: {
                slidesPerView: 3,
                spaceBetween: 24,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
              576: {
                slidesPerView: 1,
                // spaceBetween: 24,
              },
            }}
          >
            {partners()
              .reverse()
              .map((partner) => (
                <SwiperSlide key={nextId()} className="protocols__item">
                  {partner}
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
});
export default Partners;
