import React from 'react';

import logo from '../../assets/img/icons/logo.svg';
import { GradientText, TokenPanel } from '../../components';
import { About, RebalanceHistory, Table } from '../../components/IndexPage';

import './Index.scss';

const Index: React.FC = () => {
  const panelInfo = [
    {
      label: 'Market Cap',
      value: '$34.0000',
    },
    {
      label: 'Inception Date',
      value: '22.01.2021',
    },
  ];

  return (
    <main className="container page">
      <div className="page__title-row">
        <div className="page__title-icon page__title-icon--index">
          <img src={logo} alt="logo" width="31" height="28" />
        </div>

        <div className="page__title-wrapper">
          <div className="page__title">
            <GradientText width="424" height="36" text="Index name" />
          </div>
          <div className="page__title-label">Set creator</div>
        </div>
      </div>

      <TokenPanel panelContent={panelInfo} />
      <RebalanceHistory />
      <Table />
      <About />
    </main>
  );
};

export default Index;
