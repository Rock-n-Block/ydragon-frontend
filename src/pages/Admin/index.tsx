import React from 'react';
import { observer } from 'mobx-react-lite';

import { Indexes } from '../../components/Admin';
import { IToken } from '../../components/IndexPage/IndexTable';
import { CreateIndexModal } from '../../components/Modals';

export interface IIndexStatus {
  status?: 'CREATED' | 'PROCESSING' | 'FINISHED ';
}

export interface ITokensDiff {
  token: IToken;
  old_weight: string;
  diff: number;
  id: number;
  new_weight: string;
  to_delete: boolean;
  pending: boolean;
}

export interface IIndex {
  id: number;
  address: string;
  name: string;
  rebalance_date?: Date | string;
  created_at: Date | string;
  tokens: Array<IToken>;
  market_cap: number;
  price: number;
}

const Admin: React.FC = observer(() => {
  return (
    <main className="container">
      {/* <Structure /> */}
      <Indexes />
      <CreateIndexModal />
    </main>
  );
});

export default Admin;
