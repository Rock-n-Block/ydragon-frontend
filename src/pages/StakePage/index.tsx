import React from 'react';

import { Stake, StakingStatistics } from '../../components/Admin';

const StakePage: React.FC = () => {
  return (
    <main className="container">
      <Stake />
      <StakingStatistics />
    </main>
  );
};

export default StakePage;
