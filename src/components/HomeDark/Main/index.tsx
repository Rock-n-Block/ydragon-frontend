import React from 'react';
import { Button } from '../../index';

import './Main.scss';

const Main: React.FC = () => {
  return (
    <section className="section home">
      <div className="home__title-wrapper">
        <h1 className="home__title text-outline">YDRAGON</h1>
        <span className="home__sub-title">DeFi made simple</span>
      </div>

      <p className="home__descr">
        YDragon is a cross-chain index ecosystem with yield bearing collateral, providing a true{' '}
        <br /> interoperable cross-asset experience. Made by investors, for investors.
      </p>

      <div className="home__btns-row">
        <Button linkClassName="home__btn" link="/ydrtoken">
          Buy YDR
        </Button>
        <Button
          className="home__btn"
          styledType="outline"
          tooltip='Please login'
        >
          Whitepaper
        </Button>
      </div>

      <div className="home__currently-price">
        &quot;The YDragon project has currently <span>XXXX$</span> diversified among indexes&quot;.
        (TVL)
      </div>
    </section>
  );
};

export default Main;
