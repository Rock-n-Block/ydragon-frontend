import React, { useState } from 'react';
// import { TradeYDRModal } from '../../components/Modals';
// import { useMst } from '../../store/store';
import nextId from 'react-id-generator';
import { observer } from 'mobx-react-lite';

import apeswapIcon from '../../assets/img/icons/icon-apeswap.png';
import pancakeIcon from '../../assets/img/icons/icon-pancake.svg';
import uniswapIcon from '../../assets/img/icons/icon-uniswap.svg';
import logo from '../../assets/img/icons/logo.svg';
import { Button, YDRTokenChart } from '../../components';

// import { useWalletConnectorContext } from '../../services/walletConnect';
import './YDRToken.scss';

const YdrToken: React.FC = observer(() => {
  const [price, setPrice] = useState(1);
  // const { networks } = useMst();
  //  const walletConnector = useWalletConnectorContext();
  /* const panelInfo = [
    {
      label: 'Price',
      value: `$${price.toFixed(6)}`,
    },
  ]; */

  const updatePrice = (value: number) => {
    setPrice(value);
  };
  const handleBuy = (company: string) => {
    // modals.tradeYDR.open('buy');x
    switch (company) {
      case 'PancakeSwap':
        window.open(
          'https://pancakeswap.finance/swap?outputCurrency=0x3757232b55e60da4a8793183ac030cfce4c3865d',
        );
        break;
      case 'UniSwap':
        window.open(
          'https://app.uniswap.org/#/swap?outputCurrency=0x3757232b55e60da4a8793183ac030cfce4c3865d',
        );
        break;
      case 'ApeSwap':
        window.open(
          'https://app.apeswap.finance/swap?outputCurrency=0x3757232b55e60da4a8793183ac030cfce4c3865d',
        );
        break;
      default:
        break;
    }
  };
  const handleSell = (company: string) => {
    switch (company) {
      case 'PancakeSwap':
        window.open(
          'https://pancakeswap.finance/swap?inputCurrency=0x3757232b55e60da4a8793183ac030cfce4c3865d',
        );
        break;
      case 'UniSwap':
        window.open(
          'https://app.uniswap.org/#/swap?inputCurrency=0x3757232b55e60da4a8793183ac030cfce4c3865d',
        );
        break;
      case 'ApeSwap':
        window.open(
          'https://app.apeswap.finance/swap?inputCurrency=0x3757232b55e60da4a8793183ac030cfce4c3865d',
        );
        break;
      default:
        break;
    }
  };

  return (
    <main className="container page">
      <div className="page__title-row">
        <div className="page__title-icon page__title-icon--ydr">
          <img src={logo} alt="logo" width="31" height="28" />
        </div>

        <div className="page__title-wrapper">
          <h1 className="page__title text-outline">YDR token</h1>
        </div>
      </div>

      <div className="token-panel token-panel-ydr">
        <div className="token-panel__content">
          <div className="token-panel-item" key={nextId()}>
            <div className="token-panel-item__value">{`$${price.toFixed(6)}`}</div>
            <div className="token-panel-item__label">Price</div>
          </div>
        </div>

        <div className="token-panel__btns token-panel-ydr__btns">
          <div className="token-panel__btns-group">
            <div className="token-panel__info">
              <div className="token-panel__logo  logo-pancake">
                <img src={pancakeIcon} alt="pancake" />
              </div>
              <div className="token-panel__subtitle">PancakeSwap</div>
            </div>
            <div className="token-panel__btns">
              <Button className="token-panel__btn" onClick={() => handleBuy('PancakeSwap')}>
                Buy
              </Button>
              <Button
                className="token-panel__btn"
                onClick={() => handleSell('PancakeSwap')}
                styledType="outline"
              >
                Sell
              </Button>
            </div>
          </div>
          <div className="token-panel__btns-group">
            <div className="token-panel__info">
              <div className="token-panel__logo  logo-uniswap">
                <img src={uniswapIcon} alt="uniswap" />
              </div>
              <div className="token-panel__subtitle">UniSwap</div>
            </div>
            <div className="token-panel__btns">
              <Button className="token-panel__btn" onClick={() => handleBuy('UniSwap')}>
                Buy
              </Button>
              <Button
                className="token-panel__btn"
                onClick={() => handleSell('UniSwap')}
                styledType="outline"
              >
                Sell
              </Button>
            </div>
          </div>
          <div className="token-panel__btns-group">
            <div className="token-panel__info">
              <div className="token-panel__logo  logo-apeswap">
                <img src={apeswapIcon} alt="ApeSwap" />
              </div>
              <div className="token-panel__subtitle">ApeSwap</div>
            </div>
            <div className="token-panel__btns">
              <Button className="token-panel__btn" onClick={() => handleBuy('ApeSwap')}>
                Buy
              </Button>
              <Button
                className="token-panel__btn"
                onClick={() => handleSell('ApeSwap')}
                styledType="outline"
              >
                Sell
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* <TokenPanel panelContent={panelInfo} handleBuy={handleBuy} handleSell={handleSell} /> */}
      {/* <TradeYDRModal /> */}
      <YDRTokenChart price={updatePrice} className="ydragon-chart" />
    </main>
  );
});

export default YdrToken;
