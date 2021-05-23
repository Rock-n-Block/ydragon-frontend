import React from 'react';

import { Composition, Indexs, Rebalance } from '../../components/Admin';

const Admin: React.FC = () => {
  return (
    <main className="container">
      <Indexs />
      <Composition />
      <Rebalance />
    </main>
  );
};

export default Admin;
