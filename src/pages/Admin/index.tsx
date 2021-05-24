import React from 'react';

import { Composition, Indexs, Rebalance, Structure } from '../../components/Admin';

const Admin: React.FC = () => {
  return (
    <main className="container">
      <Structure />
      <Indexs />
      <Composition />
      <Rebalance />
    </main>
  );
};

export default Admin;
