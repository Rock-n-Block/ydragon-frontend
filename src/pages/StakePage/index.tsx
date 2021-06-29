import React from 'react';

import { Stake, StakingStatistics } from '../../components';

const StakePage: React.FC = () => {
  return (
    <main className="container">
      <Stake />
      <StakingStatistics />
    </main>
  );
};

export default StakePage;
