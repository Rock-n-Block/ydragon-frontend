import React from 'react';

import { GradientText } from '../../index';

import './Main.scss';

const Main: React.FC = () => {
  return (
    <section className="section home">
      <div className="home__title-wrapper">
        <h1 className="home__title">
          <GradientText width="982" height="106" text="YDRAGON" />
        </h1>
        <span className="home__sub-title">DeFi made simple</span>
      </div>

      <p className="home__descr">
        YDragon is a smart aggregation platform that solves the problems of DeFi
      </p>
    </section>
  );
};

export default Main;
