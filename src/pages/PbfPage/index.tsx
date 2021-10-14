import React from 'react';
import { FirstBlock, ConquerWithYdr, Tiers } from '../../components/PbfPage';

const PbfPage: React.FC = () => {
  return (
    <main className="pbf-page container">
      <FirstBlock />
      <ConquerWithYdr />
      <Tiers />
    </main>
  );
};

export default PbfPage;
