import React from 'react';

import { Button } from '../index';

import './TokenPanel.scss';
import nextId from 'react-id-generator';

interface TokenPanelProps {
  panelContent: Array<IPanelContent>;
}
interface IPanelContent {
  label: string;
  value: string;
}

const TokenPanel: React.FC<TokenPanelProps> = ({ panelContent }) => {
  return (
    <div className="token-panel">
      <div className="token-panel__content">
        {panelContent.map((item) => (
          <div className="token-panel-item" key={nextId()}>
            <div className="token-panel-item__value">{item.value}</div>
            <div className="token-panel-item__label">{item.label}</div>
          </div>
        ))}
      </div>

      <div className="token-panel__btns">
        <Button className="token-panel__btn">buy</Button>
        <Button className="token-panel__btn">sell</Button>
      </div>
    </div>
  );
};

export default TokenPanel;
