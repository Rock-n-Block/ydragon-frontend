import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { IIndex } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { Button, Table } from '../../index';

import './Indexes.scss';
import { Sorter } from '../../../utils/sorter';

const Indexes: React.FC = () => {
  const [indexes, setIndexes] = useState<Array<IIndex>>();

  const columns: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (item: any) => <Link to={`/admin/index/${item.id}`}>{item.name}</Link>,
      sorter: Sorter.DEFAULT,
    },
    {
      title: 'Market cap',
      dataIndex: 'cap',
      key: 'cap',
      sorter: Sorter.DEFAULT,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (item: any) => <span className="text-MER">{item}</span>,
      sorter: Sorter.DEFAULT,
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      sorter: Sorter.DEFAULT,
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);
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
  useEffect(() => {
    if (indexes) {
      const newData = indexes.map((curIndex, index) => {
        return {
          key: index,
          name: { id: curIndex.id, name: curIndex.name },
          cap: `$${curIndex.market_cap}`,
          price: `$${curIndex.price}`,
          created: moment(new Date(curIndex.created_at)).format('DD.MM.YYYY'),
        };
      });
      setDataSource(newData);
    }
  }, [indexes]);
  return (
    <section className="section section--admin">
      <div className="section__title-row">
        <h2 className="section__title text-outline">Indexes</h2>

        <Button className="index-create-btn">create new index</Button>
      </div>

      {indexes && <Table dataSource={dataSource} columns={columns} className="rebalance-table" />}
    </section>
  );
};

export default Indexes;
