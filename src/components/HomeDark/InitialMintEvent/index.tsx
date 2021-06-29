import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { indexesApi } from '../../../services/api';
import { InitialMintEventItem } from '../index';
import spinner from '../../../assets/img/icons/spinner.svg';

import './InitialMintEvent.scss';

export interface IIme {
  id: number;
  description: string | null;
  tokens: Array<IImeToken>;
  name: string;
  address: string;
  ime_start_timestamp: number;
  ime_end_timestamp: number;
}
export interface IImeToken {
  name: string;
  symbol: string;
  image: string;
  total_quantity: number;
  price: number;
  total_price: number;
  user_quantity?: number;
}
const InitialMintEvent: React.FC = observer(() => {
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
    getImeList();
  }, [getImeList]);
  return (
    <section className="section">
      <div className='spinner__wrapper'>
      {loading && <img alt="" src={spinner} width='50' height='50' />}
      </div>
      {!loading &&
        (imeList.length ? (
          <>
            <h2 className="section__title text-outline">INITIAL minting Event</h2>
            <p className="section__sub-title">FUNDED YDR ALLOCATION FOR INDEX STAKERS</p>
            {imeList.map((imeItem) => (
              <InitialMintEventItem imeItem={imeItem} />
            ))}
            )
          </>
        ) : (
          <p className="section__sub-title">There is no IME yet</p>
        ))}
    </section>
  );
});

export default InitialMintEvent;
