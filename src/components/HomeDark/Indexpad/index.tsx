import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { observer } from 'mobx-react-lite';

import { indexesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { Spinner } from '../../index';
import { IndexpadItem } from '../index';

import './Indexpad.scss';

export interface IIndexpadToken {
  count: string;
  id: number;
  address: string;
  price_total: number;
  price_for_one: number;
  image: string;
  current_weight: string;
  unit_weight: string;
  decimal: number;
  symbol: string;
  name: string;
  percent_change: number;
}

export interface IIme {
  id: number;
  description: string | null;
  tokens: Array<IIndexpadToken>;
  name: string;
  address: string;
  ime_start_timestamp: number;
  ime_end_timestamp: number;
}

export interface IImeToken {
  name: string;
  symbol: string;
  image: string;
  address: string;
  total_quantity: number;
  price: number;
  total_price: number;
  user_quantity?: number;
}

const Indexpad: React.FC = observer(() => {
  const { networks } = useMst();
  const [imeList, setImeList] = useState<IIme[]>([] as IIme[]);
  const [loading, setLoading] = useState<boolean>(false);
  const getImeList = useCallback(() => {
    setLoading(true);
    indexesApi
      .getImeIndexes()
      .then(({ data }) => {
        setImeList(data);
      })
      .catch((error) => {
        const { response } = error;
        console.log('get ime list error', response);
      })
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (networks.currentNetwork) {
      getImeList();
    }
  }, [networks.currentNetwork, getImeList]);
  return (
    <section className="section">
      <h2 className="section__title text-outline">INDEXPAD</h2>
      <p className="section__sub-title">Index minting offering for upcoming indexes</p>
      <Spinner loading={loading} />
      {imeList.length
        ? imeList.map((imeItem) => <IndexpadItem key={nextId()} imeItem={imeItem} />)
        : !loading && (
            <div className="no-ime">
              <p className="no-ime__text text-gradient">There is no IMO yet</p>
            </div>
          )}
    </section>
  );
});

export default Indexpad;
