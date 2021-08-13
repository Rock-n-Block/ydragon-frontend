import React, { useCallback } from 'react';
import { observer } from 'mobx-react';
import moonwolfL from '../../../assets/img/icons/partners/moonwolf-light.png';
import moonwolfD from '../../../assets/img/icons/partners/moonwolf-dark.png';
import marshlandL from '../../../assets/img/icons/partners/marshland-light.png';
import marshlandD from '../../../assets/img/icons/partners/marshland-dark.png';
import lossLessL from '../../../assets/img/icons/partners/lossless-light.svg';
import lossLessD from '../../../assets/img/icons/partners/lossless-dark.svg';
import magnusL from '../../../assets/img/icons/partners/magnus-light.png';
import magnusD from '../../../assets/img/icons/partners/magnus-dark.png';
import polygonL from '../../../assets/img/icons/partners/polygon-light.svg';
import polygonD from '../../../assets/img/icons/partners/polygon-dark.svg';
import bscPad from '../../../assets/img/icons/partners/bsc-pad.svg';
import hyperconnectL from '../../../assets/img/icons/partners/hyperconnect-light.svg';
import hyperconnectD from '../../../assets/img/icons/partners/hyperconnect-dark.svg';
import qiDaoL from '../../../assets/img/icons/partners/qi-dao-light.png';
import qiDaoD from '../../../assets/img/icons/partners/qi-dao-dark.png';
// import unimexL from '../../../assets/img/icons/partners/unimex-light.svg';
// import unimexD from '../../../assets/img/icons/partners/unimex-dark.svg';
import trustSwapL from '../../../assets/img/icons/partners/trust-swap-light.svg';
import trustSwapD from '../../../assets/img/icons/partners/trust-swap-dark.svg';
import { useMst } from '../../../store/store';

import './Protocols.scss';
import nextId from 'react-id-generator';

const Protocols: React.FC = observer(() => {
  const { theme } = useMst();
  const partners = useCallback(() => {
    const isLight = theme.value !== 'dark';
    return [
      <a href="https://moonwolf.io/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? moonwolfL : moonwolfD} alt="moonwolf" width="275" height="72" />
      </a>,
      <a href="https://www.marshlandcapital.com/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? marshlandL : marshlandD} alt="marshland" width="92" height="78" />
      </a>,
      <a href="https://lossless.cash/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? lossLessL : lossLessD} alt="lossLess" width="291" height="64" />
      </a>,
      <a href="https://magnusdigitalassets.com/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? magnusL : magnusD} alt="magnus capital" width="154" height="78" />
      </a>,
      <a href="https://polygon.technology/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? polygonL : polygonD} alt="polygon" width="280" height="62" />
      </a>,
      <a href="https://bscpad.com/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={bscPad} alt="bscPad" width="152" height="64" />
      </a>,
      <a href="https://www.iconhyperconnect.com/" target="_blank" className="protocols__link" rel="noreferrer">
        <img
          src={isLight ? hyperconnectL : hyperconnectD}
          alt="icon hyperconnect p-rep"
          width="290"
          height="64"
        />
      </a>,
      <a href="https://www.mai.finance/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? qiDaoL : qiDaoD} alt="Qi Dao" width="160" height="72" />
      </a>,
      <a href="https://www.trustswap.org/" target="_blank" className="protocols__link" rel="noreferrer">
        <img src={isLight ? trustSwapL : trustSwapD} alt="trustSwap" width="312" height="52" />
      </a>,

      // <img src={isLight ? unimexL : unimexD} alt="unimex" width="240" height="64" />,
    ];
  }, [theme.value]);
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
          {partners().map((partner) => (
            <div key={nextId()} className="protocols__item">
              {partner}
            </div>
          ))}
          {/* <img
            src={theme.value === 'dark' ? marshlandWhite : marshlandBlack}
            alt="marshland"
            width="92"
            height="78"
          />
          <img src={polygon} alt="" width="98" height="78" />
          <img
            src={theme.value === 'dark' ? magnusWhite : magnusBlack}
            alt="magnus"
            width="154"
            height="78"
          />
          <img src={moonwolf} alt="moonwolf" width="91" height="112" /> */}
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