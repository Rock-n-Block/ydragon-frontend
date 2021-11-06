import React, { useState, useEffect } from 'react';

import { FirstBlock, StakingStatistic, StakingTable } from '../../components/StakingPage';
import { ratesApi } from '../../services/api';

import './StakingPage.scss';

const StakingPage: React.FC = () => {
  const [ydrPrice, setYdrPrice] = useState('1');

  useEffect(() => {
    ratesApi.getYdrPrice().then((data) => setYdrPrice(data.data.ydragon));
  }, []);

  return (
    <main className="container">
      <FirstBlock />
      <StakingStatistic ydrPrice={ydrPrice} />
      <StakingTable ydrPrice={ydrPrice} />
    </main>
  );
};

export default StakingPage;
