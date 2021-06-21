import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Composition, IndexInfo, Rebalance, RebalanceModal } from '../../components/Admin';
import { indexesApi } from '../../services/api';
import { IIndex, IIndexStatus, ITokensDiff } from '../Admin';

interface IIndexId {
  indexId: string;
}

interface IRebalance extends IIndexStatus {
  index: IIndex;
  tokens_diff: Array<ITokensDiff>;
  id: number;
  term: number;
  attempts_count: number;
  market_cap: number;
  price: number;
}
const AdminIndex: React.FC = () => {
  const { indexId } = useParams<IIndexId>();
  const [index, setIndex] = useState<IRebalance>({} as IRebalance);
  const getIndexComposition = useCallback(() => {
    // TODO: change indexId dynamically
    indexesApi
      .getIndexesRebalance(+indexId)
      .then(({ data }) => {
        setIndex(data);
        console.log(data);
      })
      .catch((err) => {
        console.log(err, 'get collections');
      });
  }, [indexId]);
  useEffect(() => {
    getIndexComposition();
  }, [getIndexComposition]);
  return (
    <main className="container">
      <IndexInfo marketCap={index.market_cap} price={index.price} />
      <Composition status={index.status} tokens={index.tokens_diff} />
      <Rebalance status={index.status} tokens={index.tokens_diff} />
      <RebalanceModal name={index.index?.name} tokens={index.tokens_diff} />
    </main>
  );
};

export default AdminIndex;
