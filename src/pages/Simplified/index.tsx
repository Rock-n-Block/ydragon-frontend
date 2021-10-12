import React from 'react';

import './Simplified.scss';

import { Title, About, Purpose, Basket } from '../../components/Simplified';


const Simplified: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <About />
      <Purpose />
      <Basket />
    </main>
  );
};

export default Simplified;