import React from 'react';

import { Advantages, Features, Indexpad, Machine, Main, Partners } from '../../components/HomeDark';
import './Home.scss';

const Home: React.FC = () => {
  return (
    <main className="home-page">
      <div className="container">
        <Main />
        <Indexpad />
        <Machine />
        <Features />
        <Advantages />
        <Partners />
      </div>
    </main>
  );
};

export default Home;
