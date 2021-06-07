import React from 'react';

import { Composition, Indexs, Rebalance, RebalanceModal, Structure } from '../../components/Admin';

const Admin: React.FC = () => {
  return (
    <main className="container">
      <Structure />
      <Indexs />
      <Composition />
      <Rebalance />
      <RebalanceModal />
    </main>
  );
};

export default Admin;
