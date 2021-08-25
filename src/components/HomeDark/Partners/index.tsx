import React from 'react';
import nextId from 'react-id-generator';
import { Swiper, SwiperSlide } from 'swiper/react';

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

import 'swiper/swiper.scss';
import './Partners.scss';

const Partners: React.FC = () => {
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
    <section className="section">
      <div className="protocols-used">
        <h3 className="protocols-used__title">OUR PARTNERS</h3>

        <div className="protocols-used__row">
          <Swiper spaceBetween={60} slidesPerView={8} loop>
            {partners.map((partner) => (
              <SwiperSlide>
                <img src={partner} key={nextId()} alt="partner" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Partners;
