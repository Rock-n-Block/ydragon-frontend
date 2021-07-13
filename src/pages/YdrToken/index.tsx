import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import logo from '../../assets/img/icons/logo.svg';
import { TokenPanel, YDRTokenChart } from '../../components';
import { TradeYDRModal } from '../../components/Modals';
import { useMst } from '../../store/store';
// import { useWalletConnectorContext } from '../../services/walletConnect';

const YdrToken: React.FC = observer(() => {
  const [price, setPrice] = useState(1);
  const { modals } = useMst();
  //  const walletConnector = useWalletConnectorContext();
  const panelInfo = [
    {
      label: 'Price',
      value: `$${price.toFixed(6)}`,
    },
  ];

  const updatePrice = (value: number) => {
    setPrice(value);
  };

  const handleBuy = () => {
    console.log('handleBuy');
    modals.tradeYDR.open('buy');
    // walletConnector.metamaskService.buyYDRToken().then().catch();
  };
  const handleSell = () => {
    modals.tradeYDR.open('sell');
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

      <TokenPanel panelContent={panelInfo} handleBuy={handleBuy} handleSell={handleSell} />
      <TradeYDRModal />
      <YDRTokenChart price={updatePrice} />
    </main>
  );
});

export default YdrToken;
