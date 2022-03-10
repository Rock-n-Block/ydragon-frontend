import React from 'react';

import { Advantages, Features, Machine, Main, Partners } from '../../components/HomeDark';
import './Home.scss';
// import { Ecosystem } from '../../components';

const Home: React.FC = () => {
  return (
    <main className="home-page">
      <div className="container">
        <Main />
        {/* <Ecosystem /> */}
        {/* <Indexpad /> */}
        <Machine />
        <Features />
        <Advantages />
        <Partners />
      </div>
    </main>
  );
};

export default Home;
