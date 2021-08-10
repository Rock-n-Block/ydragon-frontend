import React from 'react';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Whitepaper from '../../../assets/pdf/YD WP.pdf';
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
        YDragon is a crypto index platform with cross-chain capabilities and yield-generation
        opportunities. This combination of market-leading features allows us to offer you a
        seamless, cross-chain, multi-asset experience. Made by investors, for investors.
      </p>

      <div className="home__btns-row">
        <Button linkClassName="home__btn" link="/ydrtoken">
          Buy YDR
        </Button>
        <Button
          link={Whitepaper}
          target="_blank"
          rel="noopener noreferrer"
          linkClassName="home__btn"
          styledType="outline"
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
