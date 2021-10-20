import React from 'react';

import { FirstBlock, StakingStatistic, StakingTable } from '../../components/StakingPage';

import './StakingPage.scss';

const StakingPage: React.FC = () => {
  return (
    <main className="container">
      <FirstBlock />
      <StakingStatistic />
      <StakingTable />
    </main>
  );
};

export default StakingPage;
