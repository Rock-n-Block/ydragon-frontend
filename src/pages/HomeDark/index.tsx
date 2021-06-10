import React from 'react';

import {
  Advantages,
  Features,
  GetInModal,
  InitialMintEvent,
  Machine,
  Main,
  Partners,
} from '../../components/HomeDark';

const Home: React.FC = () => {
  return (
    <main className="container">
      <Main />
      <InitialMintEvent />
      <Machine />
      <Features />
      <Advantages />
      <Partners />
      <GetInModal />
    </main>
  );
};

export default Home;
