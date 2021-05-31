import React, { useEffect, useState } from 'react';

import { Composition, Rebalance, RebalanceModal } from '../../components/Admin';
import { indexesApi } from '../../services/api';
import { IToken } from '../../components/IndexPage/IndexTable';

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

interface IIndex extends IIndexStatus {
  index: number;
  tokens_diff: Array<ITokensDiff>;
  id: number;
  term: number;
  attempts_count: number;
}

const Admin: React.FC = () => {
  const [index, setIndex] = useState<IIndex>({} as IIndex);
  const getIndexComposition = () => {
    // TODO: change indexId dynamically
    indexesApi
      .getIndexesRebalance(1)
      .then(({ data }) => {
        setIndex(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err, 'get collections');
      });
  };
  useEffect(() => {
    getIndexComposition();
  }, []);
  return (
    <main className="container">
      {/* <Structure /> */}
      {/* <Indexs /> */}
      <Composition status={index.status} tokens={index.tokens_diff} />
      <Rebalance status={index.status} tokens={index.tokens_diff} />
      <RebalanceModal />
    </main>
  );
};

export default Admin;
