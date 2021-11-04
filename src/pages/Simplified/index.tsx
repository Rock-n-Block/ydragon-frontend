import React from 'react';

import {
  About,
  Basket,
  Diversify,
  Governance,
  Harvest,
  Portfolio,
  Purpose,
  Terminology,
  Title,
} from '../../components/Simplified';

import './Simplified.scss';

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
