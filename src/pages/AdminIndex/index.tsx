import React, { useCallback, useEffect, useState } from 'react';
import { Composition, Rebalance, RebalanceModal } from '../../components/Admin';
import { indexesApi } from '../../services/api';
import { useParams } from 'react-router-dom';
import { IAdminIndex, IIndexStatus, ITokensDiff } from '../Admin';


interface IIndexId {
  indexId: string;
}

interface IRebalance extends IIndexStatus {
  index: IAdminIndex;
  tokens_diff: Array<ITokensDiff>;
  id: number;
  term: number;
  attempts_count: number;
}
const AdminIndex:React.FC=()=>{
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
  },[indexId]);
  useEffect(() => {
    getIndexComposition();
  }, [getIndexComposition]);
  return (
    <main className="container">
      <Composition status={index.status} tokens={index.tokens_diff} />
      <Rebalance status={index.status} tokens={index.tokens_diff} />
      <RebalanceModal name={index.index?.name} tokens={index.tokens_diff} />
    </main>
  )
}

export default AdminIndex;
