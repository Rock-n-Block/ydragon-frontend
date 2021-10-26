import React from 'react';

import {
  Advantages,
  Features,
  Indexpad,
  Machine,
  Main,
  Partners,
  // Partners,
} from '../../components/HomeDark';

const Home: React.FC = () => {
  return (
    <main className="container">
      <Main />
      <Indexpad />
      <Machine />
      <Features />
      <Advantages />
      <Partners />
      {/* <Partners /> */}
    </main>
  );
};

export default Home;
