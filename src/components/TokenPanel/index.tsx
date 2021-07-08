import React, { useState } from 'react';
import nextId from 'react-id-generator';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../store/store';
import { Button } from '../index';

import './TokenPanel.scss';
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
    const [showTooltip, setShowTooltip] = useState(false);
    const [pickTooltip, setPickTooltip] = useState<number | undefined>(undefined);
    // const walletConnector = useWalletConnectorContext();
    const { user } = useMst();
    const isTokenPicked = !!user.token;
    const isUserLogged = !!localStorage?.yd_address || false;
    const onClickHandler = (e: any) => {
      e.preventDefault();
      setShowTooltip(true);
    };
    const onFocusHandler = (value: number) => {
      setPickTooltip(value);
    };
    const onBlurHandler = () => {
      setShowTooltip(false);
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
          {((isTokenPicked && handleBuy) || (!isTokenPicked && handleBuy)) && (
            <Button
              className="token-panel__btn"
              onClick={isUserLogged ? handleBuy : (e) => onClickHandler(e)}
              onBlur={onBlurHandler}
              onFocus={() => onFocusHandler(1)}
            >
              {pickTooltip === 1 && !isUserLogged && showTooltip && (
                <div className="ant-tooltip ant-tooltip-placement-top">
                  <div className="ant-tooltip-content">
                    <div className="ant-tooltip-arrow">
                      <span className="ant-tooltip-arrow-content" />
                    </div>
                    <div className="ant-tooltip-inner" role="tooltip">
                      Please login
                    </div>
                  </div>
                </div>
              )}
              Buy
            </Button>
          )}
          {((isTokenPicked && handleSell) || (!isTokenPicked && handleSell)) && (
            <Button
              className="token-panel__btn"
              onClick={isUserLogged ? handleSell : (e) => onClickHandler(e)}
              onBlur={onBlurHandler}
              onFocus={() => onFocusHandler(2)}
            >
              {pickTooltip === 2 && !isUserLogged && showTooltip && (
                <div className="ant-tooltip ant-tooltip-placement-top">
                  <div className="ant-tooltip-content">
                    <div className="ant-tooltip-arrow">
                      <span className="ant-tooltip-arrow-content" />
                    </div>
                    <div className="ant-tooltip-inner" role="tooltip">
                      Please login
                    </div>
                  </div>
                </div>
              )}
              Sell
            </Button>
          )}
        </div>
      </div>
    );
  },
);

export default TokenPanel;
