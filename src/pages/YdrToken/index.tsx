import React from 'react';

import logo from '../../assets/img/icons/logo.svg';
import { TokenPanel } from '../../components';
// import { useWalletConnectorContext } from '../../services/walletConnect';

const YdrToken: React.FC = () => {
  //  const walletConnector = useWalletConnectorContext();
  const panelInfo = [
    {
      label: 'Price',
      value: '$255',
    },
  ];
  const handleBuy = () => {
    // walletConnector.metamaskService.buyYDRToken().then().catch();
  };
  const handleSell = () => {};

  return (
    <main className="container page">
      <div className="page__title-row">
        <div className="page__title-icon page__title-icon--ydr">
          <img src={logo} alt="logo" width="31" height="28" />
        </div>

        <div className="page__title-wrapper">
          <h1 className="page__title text-outline">YDR token</h1>
          <span className="page__title-label">Set creator</span>
        </div>
      </div>

      <TokenPanel panelContent={panelInfo} handleBuy={handleBuy} handleSell={handleSell} />
    </main>
  );
};

export default YdrToken;
