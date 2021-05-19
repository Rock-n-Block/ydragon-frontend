import React from 'react';

import './Home.scss'

const Home: React.FC = () => {
  return (
    <main>
      <div className="container">
        <div className="home">
          <div className="home__title-wrapper">
            <div className="home__title">YDRAGON</div>
            <div className="home__sub-title">DeFi made simple</div>
          </div>

          <div className="home__descr">YDragon is a smart aggregation platform that solves the problems of DeFi</div>
        </div>
      </div>
    </main>
  );
}

export default Home;
