import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react';
import SwiperCore, { Autoplay } from 'swiper/core';

import { useMst } from '../../../store/store';
import { partners, partnersSetArray, TPartnerSet } from './partners';
import 'swiper/swiper.scss';
import './Partners.scss';

SwiperCore.use([Autoplay]);

const Partners: React.FC = observer(() => {
  const { theme } = useMst();
  const [partnersTab, setPartnersTab] = useState<TPartnerSet>('Binance Smart Chain');

  const isLight = useMemo(() => {
    return theme.value !== 'dark';
  }, [theme.value]);

  const toNextTab = useCallback(() => {
    console.log('toNextTab called');
    const indexOfCurrentTab = partnersSetArray.indexOf(partnersTab);
    const isTabLast = indexOfCurrentTab === partnersSetArray.length - 1;
    const nextTab = isTabLast ? partnersSetArray[0] : partnersSetArray[indexOfCurrentTab + 1];
    setPartnersTab(nextTab);
  }, [partnersTab]);

  useEffect(() => {
    const switchTabInterval = setInterval(toNextTab, 5000);
    return () => clearInterval(switchTabInterval);
  }, [toNextTab]);

  return (
    <section className="section">
      <h3 className="section__title text-outline">protocols & partners</h3>
      <div className="partners">
        {/* <div className="partners__row">
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
        </div> */}
        <div className="partners__tabs">
          {partnersSetArray.map((partnersTabName) => (
            <button
              type="button"
              key={`partners-tab_${partnersTabName}`}
              className={`partners__tabs_btn ${
                partnersTabName === partnersTab ? 'partners__tabs_btn-active' : ''
              }`}
              onClick={() => {
                setPartnersTab(partnersTabName);
              }}
            >
              {partnersTabName}
            </button>
          ))}
        </div>
        <div className="partners__block">
          {partners[partnersTab].map((partner) => (
            <div className="partners__item" key={`partner ${partner.name}`}>
              <a href={partner.link} target="_blank" className="partners__link" rel="noreferrer">
                <img
                  src={isLight ? partner.image.light : partner.image.dark}
                  alt={partner.name}
                  width={partner.width}
                  height={partner.height}
                />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
export default Partners;
