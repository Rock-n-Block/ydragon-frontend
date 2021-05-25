import React from 'react';

import { GradientText } from '../..';

import './Main.scss';

const Main: React.FC = () => {
  return (
    <section className="section home">
      <div className="home__title-wrapper">
        <div className="home__title">
          <GradientText width="982" height="106" text="YDRAGON" />
        </div>
        <div className="home__sub-title">DeFi made simple</div>
      </div>

      <div className="home__descr">
        YDragon is a smart aggregation platform that solves the problems of DeFi
      </div>
    </section>
  );
};

export default Main;
