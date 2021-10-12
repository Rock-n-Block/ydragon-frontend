import React from 'react';

import './Simplified.scss';

import { Title, About, Purpose, Basket, Diversify } from '../../components/Simplified';


const Simplified: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <About />
      <Purpose />
      <Basket />
      <Diversify />
    </main>
  );
};

export default Simplified;