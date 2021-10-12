import React from 'react';

import './Simplified.scss';

import { Title, About, Purpose } from '../../components/Simplified';


const Simplified: React.FC = () => {
  return (
    <main className="container">
      <Title />
      <About />
      <Purpose />
    </main>
  );
};

export default Simplified;