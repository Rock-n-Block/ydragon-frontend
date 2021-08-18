import React from 'react';
import './PoweredBy.scss';
import rnbLogo from '../../../assets/img/icons/rnb-logo.svg';

const PoweredBy: React.FC = () => {
  return (
    <div className="powered">
      <a href="https://rocknblock.io/" target="_blank" rel="noopener noreferrer">
        <p className="powered-by">Powered by</p>
        <img src={rnbLogo} className="powered-logo" alt="Rock'n'Block logo" />
      </a>
    </div>
  );
};

export default PoweredBy;
