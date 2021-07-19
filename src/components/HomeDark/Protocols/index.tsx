import React from 'react';
import { observer } from 'mobx-react';

import magnusBlack from '../../../assets/img/icons/partners/magnus-black.png';
// import aave from '../../../assets/img/icons/partners/aave.svg';
// import balancer from '../../../assets/img/icons/partners/balancer.svg';
// import cube from '../../../assets/img/icons/partners/cube.svg';
// import cubesWhite from '../../../assets/img/icons/partners/cubes-white.svg';
// import cubesBlack from '../../../assets/img/icons/partners/cubes-black.svg';
import magnusWhite from '../../../assets/img/icons/partners/magnus-white.png';
import marshlandBlack from '../../../assets/img/icons/partners/marshland-black.svg';
// import maker from '../../../assets/img/icons/partners/maker.svg';
import marshlandWhite from '../../../assets/img/icons/partners/marshland-white.svg';
// import mmmmWhite from '../../../assets/img/icons/partners/mmmm-white.svg';
// import mmmmBlack from '../../../assets/img/icons/partners/mmmm-black.svg';
// import nexusWhite from '../../../assets/img/icons/partners/nexus-white.svg';
// import nexusBlack from '../../../assets/img/icons/partners/nexus-black.svg';
import polygon from '../../../assets/img/icons/partners/polygon.svg';
import squareBlack from '../../../assets/img/icons/partners/square-black.svg';
import squareWhite from '../../../assets/img/icons/partners/square-white.svg';
// import nextId from 'react-id-generator';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import slide1 from '../../../assets/img/partners/logo-1.png';
// import slide2 from '../../../assets/img/partners/logo-2.png';
// import slide3 from '../../../assets/img/partners/logo-3.png';
// import slide4 from '../../../assets/img/partners/logo-4.png';
// import slide5 from '../../../assets/img/partners/logo-5.png';
// import slide6 from '../../../assets/img/partners/logo-6.png';
// import slide7 from '../../../assets/img/partners/logo-7.png';
// import slide8 from '../../../assets/img/partners/logo-8.png';
// import slide9 from '../../../assets/img/partners/logo-9.png';
// import slide10 from '../../../assets/img/partners/logo-10.png';
import { useMst } from '../../../store/store';

// import ssss from '../../../assets/img/icons/partners/ssss.svg';
// import synth from '../../../assets/img/icons/partners/synth.svg';
// import walls from '../../../assets/img/icons/partners/walls.svg';
// import avaLabsWhite from '../../../assets/img/icons/partners/ava-labs-white.png';
// import avaLabsBlack from '../../../assets/img/icons/partners/ava-labs-black.png';
// import 'swiper/swiper.scss';
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
          <img src={theme.value === 'dark' ? marshlandWhite : marshlandBlack} alt="" />
          <img src={polygon} alt="" />
          <img src={theme.value === 'dark' ? squareWhite : squareBlack} alt="" />
          <img src={theme.value === 'dark' ? magnusWhite : magnusBlack} alt="" />
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
