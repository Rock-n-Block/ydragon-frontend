import React from 'react';
import nextId from 'react-id-generator';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../store/store';
import { Button } from '../index';

import './TokenPanel.scss';
// import { useWalletConnectorContext } from '../../services/walletConnect';

interface TokenPanelProps {
  panelContent: Array<IPanelContent>;
  handleBuy?: () => void;
  handleGetIn?: () => void;
  handleSell?: () => void;
}
interface IPanelContent {
  label: string;
  value: string;
}

const TokenPanel: React.FC<TokenPanelProps> = observer(
  ({ panelContent, handleBuy, handleGetIn, handleSell }) => {
    // const walletConnector = useWalletConnectorContext();
    const { user } = useMst();
    const isTokenPicked = !!user.token;
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
          {((isTokenPicked && handleBuy) || (!isTokenPicked && handleBuy && !handleGetIn)) && (
            <Button className="token-panel__btn" onClick={handleBuy}>
              buy
            </Button>
          )}
          {((isTokenPicked && handleSell) || (!isTokenPicked && handleSell && !handleGetIn)) && (
            <Button className="token-panel__btn" onClick={handleSell}>
              sell
            </Button>
          )}
          {!isTokenPicked && handleGetIn && (
            <Button className="token-panel__btn" onClick={handleGetIn}>
              Get in!
            </Button>
          )}
        </div>
      </div>
    );
  },
);

export default TokenPanel;
