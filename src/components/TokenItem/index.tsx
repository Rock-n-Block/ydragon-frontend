import React from 'react';

import './TokenItem.scss';
import TokenMini from '../TokenMini';

const TokenItem: React.FC<{ icon: string; name: string; abbr: string; weight: string }> = ({
  icon,
  name,
  abbr,
  weight,
}) => {
  return (
    <div className="token-item">
      <TokenMini name={name} icon={icon} symbol={abbr} />

      <div className="token-item__weight">
        <span>{weight}</span>
      </div>
    </div>
  );
};

export default TokenItem;
