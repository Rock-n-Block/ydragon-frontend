import React from 'react';
import './PoweredBy.scss';
import rnbLogoD from '../../../assets/img/icons/rnb-logo.svg';
import rnbLogoL from '../../../assets/img/icons/rnb-logo-light.svg';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';

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
