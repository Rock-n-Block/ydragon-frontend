import React from 'react';

import './TokenMini.scss';

export interface TokenMiniProps {
  icon?: string;
  name: string;
  symbol?: string;
}

const TokenMini: React.FC<TokenMiniProps> = ({ icon, name, symbol }) => {
  return (
    <div className="token-mini">
      {icon ? (
        <img src={icon} alt={`${name} logo`} width="36" height="36" className="token-mini__icon" />
      ) : (
        <></>
      )}
      <div className="token-mini__name-wrapper">
        <div className="token-mini__name">{name}</div>
        {symbol && <div className="token-mini__symbol">{symbol}</div>}
      </div>
    </div>
  );
};
export default TokenMini;
