import React from 'react';

import './Main.scss';

const Main: React.FC = () => {
  return (
    <section className="section home">
      <div className="home__title-wrapper">
        <h1 className="home__title text-outline">YDRAGON</h1>
        <span className="home__sub-title">DeFi made simple</span>
      </div>

      <p className="home__descr">
        YDragon is a smart aggregation platform that solves the problems of DeFi
      </p>
    </section>
  );
};

export default Main;
