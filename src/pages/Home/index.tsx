import React from 'react';

import { About, Advantages, Future, Machine, Main } from '../../components/Home';

const Home: React.FC = () => {
  return (
    <main className="container">
      <Main />
      <Advantages />
      <Machine />
      <Future />
      <About />
    </main>
  );
};

export default Home;
