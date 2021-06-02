import React from 'react';

import {
  About,
  Advantages,
  Future,
  GetInModal,
  InitialMintEvent,
  Machine,
  Main,
} from '../../components/Home';

const Home: React.FC = () => {
  return (
    <main className="container">
      <Main />
      <InitialMintEvent />
      <Advantages />
      <Machine />
      <Future />
      <About />
      <GetInModal />
    </main>
  );
};

export default Home;
