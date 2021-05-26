import React from 'react';

import logo from '../../assets/img/icons/logo.svg';
import { GradientText, TokenPanel } from '../../components';

const YdrToken: React.FC = () => {
  const panelInfo = [
    {
      label: 'Price',
      value: '$255',
    },
  ];

  return (
    <main className="container page">
      <div className="page__title-row">
        <div className="page__title-icon page__title-icon--ydr">
          <img src={logo} alt="logo" width="31" height="28" />
        </div>

        <div className="page__title-wrapper">
          <h1 className="page__title">
            <GradientText width="392" height="36" text="YDR token" />
          </h1>
          <span className="page__title-label">Set creator</span>
        </div>
      </div>

      <TokenPanel panelContent={panelInfo} />
    </main>
  );
};

export default YdrToken;
