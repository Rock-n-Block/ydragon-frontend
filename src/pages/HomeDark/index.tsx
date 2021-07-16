import React from 'react';

import {
  Advantages,
  Features,
  InitialMintEvent,
  Machine,
  Main,
  Protocols,
  // Partners,
} from '../../components/HomeDark';

const Home: React.FC = () => {
  return (
    <main className="container">
      <Main />
      <InitialMintEvent />
      <Protocols />
      <Machine />
      <Features />
      <Advantages />
      {/* <Partners /> */}
    </main>
  );
};

export default Home;
