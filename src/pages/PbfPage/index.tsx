import React from 'react';
import { FirstBlock, ConquerWithYdr, Tiers, Benefits, OurFunds } from '../../components/PbfPage';

const PbfPage: React.FC = () => {
  return (
    <main className="pbf-page container">
      <FirstBlock />
      <ConquerWithYdr />
      <Tiers />
      <Benefits />
      <OurFunds />
    </main>
  );
};

export default PbfPage;
