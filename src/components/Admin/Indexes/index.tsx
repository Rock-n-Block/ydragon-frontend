import React, { useCallback, useEffect, useState } from 'react';

import { Button } from '../../index';
import { Link } from 'react-router-dom';

import './Indexes.scss';
import { indexesApi } from '../../../services/api';
import { IAdminIndex } from '../../../pages/Admin';
import nextId from 'react-id-generator';


const Indexes: React.FC = () => {
  const [indexes,setIndexes]=useState<Array<IAdminIndex>>()

  const getIndexes = useCallback(() => {
    indexesApi.getIndexes().then(({ data }) => {
      setIndexes(data);
    }).catch((error) => {
      const { response } = error;
      console.log('get indexes error', response);
    });
  }, []);
  useEffect(() => {
    getIndexes();
  }, [getIndexes]);
  return (
    <section className='section section--admin'>
      <div className='section__title-row'>
        <h2 className='section__title text-outline'>Indexes</h2>

        <Button className='index-create-btn'>create new index</Button>
      </div>

      <div className='indexs-table'>
        <div className='indexs-table__row indexs-table__row--head'>
          <div className='indexs-table__col'>
            <div className='indexs-table__sort indexs-table__sort--up'>Name</div>
          </div>
          <div className='indexs-table__col'>
            <div className='indexs-table__sort'>Market cap</div>
          </div>
          <div className='indexs-table__col'>
            <div className='indexs-table__sort'>Price</div>
          </div>
          <div className='indexs-table__col'>
            <div className='indexs-table__sort'>Cteated</div>
          </div>
        </div>

        <div className='indexs-table__content'>
          {indexes?.map((index:IAdminIndex)=>(
            <div className='indexs-table__row' key={nextId()}>
              <Link to={`/admin/index/${index.id}`} className='indexs-table__col'>
                <div className='indexs-table__name'>{index.name}</div>
              </Link>
              <div className='indexs-table__col'>
                <div className='indexs-table__market-cup'>4.9938</div>
              </div>
              <div className='indexs-table__col'>
                <div className='indexs-table__price'>$375</div>
              </div>
              <div className='indexs-table__col'>
                <div className='indexs-table__created'>20.04.2021</div>
              </div>
            </div>))}
        </div>
      </div>
    </section>
  );
};

export default Indexes;
