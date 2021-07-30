import React from 'react';
import { observer } from 'mobx-react';

import magnusBlack from '../../../assets/img/icons/partners/magnus-black.png';
import magnusWhite from '../../../assets/img/icons/partners/magnus-white.png';
import marshlandBlack from '../../../assets/img/icons/partners/marshland-black.svg';
import marshlandWhite from '../../../assets/img/icons/partners/marshland-white.svg';
import moonwolf from '../../../assets/img/icons/partners/moonwolf.png';
import polygon from '../../../assets/img/icons/partners/polygon.svg';
// import squareBlack from '../../../assets/img/icons/partners/square-black.svg';
// import squareWhite from '../../../assets/img/icons/partners/square-white.svg';
import { useMst } from '../../../store/store';

import './Protocols.scss';

const Protocols: React.FC = observer(() => {
  const { theme } = useMst();

  return (
    <section className="section">
      <h3 className="section__title text-outline">Our partners</h3>
      <div className="protocols">
        <div className="protocols__row">
          <img
            src={theme.value === 'dark' ? marshlandWhite : marshlandBlack}
            alt="marshland"
            width="92"
            height="78"
          />
          <img src={polygon} alt="" width="98" height="78" />
          {/* <img
            src={theme.value === 'dark' ? squareWhite : squareBlack}
            alt="square"
            width="95"
            height="80"
          /> */}
          <img
            src={theme.value === 'dark' ? magnusWhite : magnusBlack}
            alt="magnus"
            width="154"
            height="78"
          />
          <img src={moonwolf} alt="magnus" width="91" height="112" />
        </div>
      </div>
    </section>
  );
});

export default Protocols;
