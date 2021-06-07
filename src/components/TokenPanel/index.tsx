import React from 'react';
import nextId from 'react-id-generator';

import { Button } from '../index';

import './TokenPanel.scss';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store/store';
// import { useWalletConnectorContext } from '../../services/walletConnect';

interface TokenPanelProps {
  panelContent: Array<IPanelContent>;
  handleBuy?: () => void;
  handleSell?: () => void;
}
interface IPanelContent {
  label: string;
  value: string;
}

const TokenPanel: React.FC<TokenPanelProps> = observer(
  ({ panelContent, handleBuy, handleSell }) => {
    // const walletConnector = useWalletConnectorContext();
    const { user, modals } = useMst();
    const isTokenPicked = !!user.token;
    const handleGetIn = () => {
      modals.getIn.open();
    };
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
          {isTokenPicked ? (
            <>
              <Button className="token-panel__btn" onClick={handleBuy}>
                buy
              </Button>
              <Button className="token-panel__btn" onClick={handleSell}>
                sell
              </Button>
            </>
          ) : (
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
