import React from 'react';

import './Simplified.scss';

import { Title, About, Purpose, Basket, Diversify, Harvest, Portfolio, Governance, Other } from '../../components/Simplified';


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
      <Other />
    </main>
  );
};

export default Simplified;