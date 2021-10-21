import React from 'react';

import {
  Advantages,
  Features,
  InitialMintEvent,
  Machine,
  Main,
  Partners,
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
      <Partners />
      {/* <Partners /> */}
    </main>
  );
};

export default Home;
