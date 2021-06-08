import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '../../index';
import { Link } from 'react-router-dom';

import './Indexes.scss';
import { indexesApi } from '../../../services/api';
import { IIndex } from '../../../pages/Admin';
import nextId from 'react-id-generator';
import moment from 'moment';

const Indexes: React.FC = () => {
  const [indexes, setIndexes] = useState<Array<IIndex>>();

  const getIndexes = useCallback(() => {
    indexesApi
      .getAdminIndexes()
      .then(({ data }) => {
        setIndexes(data);
      })
      .catch((error) => {
        const { response } = error;
        console.log('get indexes error', response);
      });
  }, []);
  useEffect(() => {
    getIndexes();
  }, [getIndexes]);
  return (
    <section className="section section--admin">
      <div className="section__title-row">
        <h2 className="section__title text-outline">Indexes</h2>

        <Button className="index-create-btn">create new index</Button>
      </div>

      <div className="indexs-table">
        <div className="indexs-table__row indexs-table__row--head">
          <div className="indexs-table__col">
            <div className="indexs-table__sort indexs-table__sort--up">Name</div>
          </div>
          <div className="indexs-table__col">
            <div className="indexs-table__sort">Market cap</div>
          </div>
          <div className="indexs-table__col">
            <div className="indexs-table__sort">Price</div>
          </div>
          <div className="indexs-table__col">
            <div className="indexs-table__sort">Cteated</div>
          </div>
        </div>

        <div className="indexs-table__content">
          {indexes?.map((index: IIndex) => (
            <div className="indexs-table__row" key={nextId()}>
              <Link to={`/admin/index/${index.id}`} className="indexs-table__col">
                <div className="indexs-table__name">{index.name}</div>
              </Link>
              <div className="indexs-table__col">
                <div className="indexs-table__market-cup">${index.market_cap}</div>
              </div>
              <div className="indexs-table__col">
                <div className="indexs-table__price">${index.price}</div>
              </div>
              <div className="indexs-table__col">
                <div className="indexs-table__created">
                  {moment(new Date(index.created_at)).format('DD.MM.YYYY')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Indexes;
