import React from 'react';

import './TokenItem.scss';

const TokenItem: React.FC<{ icon: string; name: string; abbr: string; weight: string }> = ({
  icon,
  name,
  abbr,
  weight,
}) => {
  return (
    <div className="token-item">
      <div className="token-item__info">
        <img src={icon} alt="" width="36" height="36" className="token-item__icon" />

        <div className="token-item__name-wrapper">
          <div className="token-item__name">{name}</div>
          <div className="token-item__abbr">{abbr}</div>
        </div>
      </div>

      <div className="token-item__weight">{weight}</div>
    </div>
  );
};

export default TokenItem;
