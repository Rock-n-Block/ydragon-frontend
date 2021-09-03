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
      <Machine />
      <Features />
      <Advantages />
      <Protocols />
      {/* <Partners /> */}
    </main>
  );
};

export default Home;
