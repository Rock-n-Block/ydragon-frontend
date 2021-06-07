import React from 'react';

import {Indexes} from '../../components/Admin';
import { IToken } from '../../components/IndexPage/IndexTable';
import { observer } from 'mobx-react-lite';

export interface IIndexStatus {
  status: 'CREATED' | 'PROCESSING' | 'FINISHED ';
}

export interface ITokensDiff {
  token: IToken;
  old_weight: string;
  diff: number;
  id: number;
  new_weight: string;
}

export interface IAdminIndex {
  id: number;
  name: string;
  rebalance_date?: Date | string;
  tokens?:Array<IToken>;
}


const Admin: React.FC = observer(() => {
  return (
    <main className='container'>
      {/* <Structure /> */}
      <Indexes />
    </main>
  );
});

export default Admin;
