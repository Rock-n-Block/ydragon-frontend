import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import './InitialMintEvent.scss';
import { indexesApi } from '../../../services/api';
import { InitialMintEventItem } from '../index';
import { useMst } from '../../../store/store';

export interface IIme {
  id: number;
  tokens: Array<IImeToken>;
  name: string;
  address: string;
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
  const { ime } = useMst();
  const [imeList, setImeList] = useState<IIme[]>([] as IIme[]);

  const getImeList = useCallback(() => {
    indexesApi
      .getImeIndexes()
      .then(({ data }) => {
        setImeList(data);
        ime.setId(data[0].id);
        ime.setAddress(data[0].address);
      })
      .catch((error) => {
        const { response } = error;
        console.log('get ime list error', response);
      });
  }, [ime]);
  useEffect(() => {
    getImeList();
  }, [getImeList]);
  return imeList.length ? (
    <section className="section">
      <h2 className="section__title text-outline">INITIAL minting Event</h2>
      <p className="section__sub-title">FUNDED YDR ALLOCATION FOR INDEX STAKERS</p>
      {imeList.map((imeItem) => (
        <InitialMintEventItem imeItem={imeItem} />
      ))}
    </section>
  ) : (
    <></>
  );
});

export default InitialMintEvent;
