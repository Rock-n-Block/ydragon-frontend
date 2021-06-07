import React from 'react';

import { About, Advantages, Future, InitialMintEvent, Machine, Main } from '../../components/Home';

const Home: React.FC = () => {
  return (
    <main className="container">
      <Main />
      <InitialMintEvent />
      <Advantages />
      <Machine />
      <Future />
      <About />
    </main>
  );
};

export default Home;
