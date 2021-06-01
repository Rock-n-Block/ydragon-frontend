import React, { useEffect, useState } from 'react';

import { Composition, Rebalance, RebalanceModal } from '../../components/Admin';
import { indexesApi } from '../../services/api';
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
export interface IIndex{
  id:number;
  name:string;
  rebalance_date?:Date|string;
}
interface IRebalance extends IIndexStatus {
  index: IIndex;
  tokens_diff: Array<ITokensDiff>;
  id: number;
  term: number;
  attempts_count: number;
}

const Admin: React.FC = observer(() => {
  const [index, setIndex] = useState<IRebalance>({} as IRebalance);
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
      <RebalanceModal name={index.index?.name} tokens={index.tokens_diff}/>
    </main>
  );
});

export default Admin;
