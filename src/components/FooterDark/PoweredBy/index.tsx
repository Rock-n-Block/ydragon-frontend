import React from 'react';
import { observer } from 'mobx-react-lite';

import rnbLogoL from '../../../assets/img/icons/rnb-logo-light.svg';
import rnbLogoD from '../../../assets/img/icons/rnb-logo.svg';
import { useMst } from '../../../store/store';

import './PoweredBy.scss';

const PoweredBy: React.FC = observer(() => {
  const { theme } = useMst();

  return (
    <a className="powered" href="https://rocknblock.io/" target="_blank" rel="noopener noreferrer">
      <p className="powered-by">Powered by</p>
      <img
        src={theme.value === 'dark' ? rnbLogoD : rnbLogoL}
        className="powered-logo"
        alt="Rock'n'Block logo"
      />
    </a>
  );
});

export default PoweredBy;
