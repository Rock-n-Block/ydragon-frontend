import React from 'react';

import { Button } from '../../index';

import './OurFunds.scss';

import { ReactComponent as SolanaLogo } from '../../../assets/img/pbf-page/solana-logo.svg';

const OurFunds: React.FC = () => {
  return (
    <section className="ourfunds section">
      <h2 className="ourfunds-title text-gradient">our funds</h2>
      <div className="ourfunds-content">
        <div className="ourfunds-content__left">
          <div className="ourfunds-content__title text-MER">solana private fund</div>
          <div className="ourfunds-content__subtitle">
            The Solana Private Fund is built to gain exposure to current and emerging projects on
            the Solana Blockchain.
          </div>
        </div>
        <div className="ourfunds-content__right">
          <div className="ourfunds-content__solana-logo">
            <SolanaLogo />
          </div>
          <div className="ourfunds-content__buttons">
            <Button>Learn more</Button>
            <Button styledType="outline">Closed</Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OurFunds;
