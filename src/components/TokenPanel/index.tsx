import React from 'react';

import { Button } from '../index';

import './TokenPanel.scss';

const TokenPanel: React.FC<{ panelContent: Array<any> }> = ({ panelContent }) => {
  return (
    <div className="token-panel">
      <div className="token-panel__content">
        {panelContent.map((item) => (
          <div className="token-panel-item">
            <div className="token-panel-item__value">{item.value}</div>
            <div className="token-panel-item__label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="token-panel__btns">
        <Button className="token-panel__btn" text="buy" />
        <Button className="token-panel__btn" text="sell" />
      </div>
    </div>
  );
};

export default TokenPanel;
