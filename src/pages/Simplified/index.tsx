import React from 'react';

import './Simplified.scss';

import { Title, About, Purpose, Basket, Diversify, Harvest, Portfolio, Governance, Terminology } from '../../components/Simplified';


const Simplified: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <About />
      <Purpose />
      <Basket />
      <Diversify />
      <Harvest />
      <Portfolio />
      <Governance />
      <Terminology />
    </main>
  );
};

export default Simplified;