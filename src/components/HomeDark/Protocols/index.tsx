import React from 'react';
import { observer } from 'mobx-react';

import magnusBlack from '../../../assets/img/icons/partners/magnus-black.png';
import magnusWhite from '../../../assets/img/icons/partners/magnus-white.png';
import marshlandBlack from '../../../assets/img/icons/partners/marshland-black.svg';
import marshlandWhite from '../../../assets/img/icons/partners/marshland-white.svg';
import moonwolf from '../../../assets/img/icons/partners/moonwolf.png';
import polygon from '../../../assets/img/icons/partners/polygon.svg';
import { useMst } from '../../../store/store';

import './Protocols.scss';

const Protocols: React.FC = observer(() => {
  const { theme } = useMst();
  // const partners = [
  //   slide1,
  //   slide2,
  //   slide3,
  //   slide4,
  //   slide5,
  //   slide6,
  //   slide7,
  //   slide8,
  //   slide9,
  //   slide10,
  // ];

  return (
    <section className="section">
      <h3 className="section__title text-outline">Our partners</h3>
      <div className="protocols">
        <div className="protocols__row">
          {/*  <img src={maker} alt="" />
        <img src={aave} alt="" />
        <img src={ssss} alt="" />
        <img src={synth} alt="" />
        <img src={walls} alt="" />
        <img src={cube} alt="" />
        <img src={theme.value === 'dark' ? cubesWhite : cubesBlack} alt="" />
        <img src={theme.value === 'dark' ? nexusWhite : nexusBlack} alt="" />
        <img src={balancer} alt="" />
        <img src={theme.value === 'dark' ? mmmmWhite : mmmmBlack} alt="" /> */}
          <img
            src={theme.value === 'dark' ? marshlandWhite : marshlandBlack}
            alt="marshland"
            width="92"
            height="78"
          />
          <img src={polygon} alt="" width="98" height="78" />
          {/* <img src={theme.value === 'dark' ? squareWhite : squareBlack} alt="square" width="95" height="80"/> */}
          <img
            src={theme.value === 'dark' ? magnusWhite : magnusBlack}
            alt="magnus"
            width="154"
            height="78"
          />
          <img src={moonwolf} alt="moonwolf" width="91" height="112" />
          {/* <Swiper spaceBetween={60} slidesPerView={8} loop>
            {partners.map((partner) => (
              <SwiperSlide>
                <img src={partner} key={nextId()} alt="" />
              </SwiperSlide>
            ))}
          </Swiper> */}
        </div>

        {/*  <h3 className="protocols__title">Advisors</h3>

        <img
          className="ava-labs-icon"
          src={theme.value === 'dark' ? avaLabsWhite : avaLabsBlack}
          alt=""
        /> */}
      </div>
    </section>
  );
});

export default Protocols;
