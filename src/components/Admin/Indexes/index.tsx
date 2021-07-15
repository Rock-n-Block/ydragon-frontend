import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { IIndex } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { Button, Spinner, Table } from '../../index';

import { IndexCardMobile } from './IndexCardMobile/index';

import './Indexes.scss';

const Indexes: React.FC = observer(() => {
  const { modals } = useMst();
  const [indexes, setIndexes] = useState<Array<IIndex>>();

  const columns: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (item: any) => <Link to={`/admin/index/${item.id}`}>{item.name}</Link>,
    },
    {
      title: 'Market cap',
      dataIndex: 'cap',
      key: 'cap',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (item: any) => <span className="text-MER">{item}</span>,
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const getIndexes = useCallback(() => {
    setLoading(true);
    indexesApi
      .getAdminIndexes()
      .then(({ data }) => {
        console.log('get indexes success', data);
        setIndexes(data);
      })
      .catch((error) => {
        const { response } = error;
        console.log('get indexes error', response);
        setLoading(false);
      });
  }, []);
  const handleCreate = (): void => {
    modals.createIndex.open();
  };
  useEffect(() => {
    getIndexes();
  }, [getIndexes]);
  useEffect(() => {
    if (indexes) {
      const newData = indexes.map((curIndex, index) => {
        let result
        if (curIndex.price > 0) {
          result =   {
            key: index,
            name: { id: curIndex.id, name: curIndex.name },
            cap: `$${curIndex.market_cap}`,
            price: `$${curIndex.price}`,
            created: moment(new Date(curIndex.created_at)).format('DD.MM.YY'),
          };
        }
        return result
      });
      setDataSource(newData.filter(item => item));
      setLoading(false);
    }
  }, [indexes]);

  return (
    <section className="section section--admin">
      <div className="section__title-row">
        <h2 className="section__title text-outline">Indexes</h2>

        <Button className="index-create-btn" onClick={handleCreate}>
          create new index
        </Button>
      </div>
      <Spinner loading={loading} />
      {indexes && (
        <>
          <div className="indexs__table-big">
            <Table dataSource={dataSource} columns={columns} className="rebalance-table" />
          </div>
          <div className="indexs__table-small">
            {dataSource.map((data) => (
              <IndexCardMobile {...data} />
            ))}
          </div>
        </>
      )}
    </section>
  );
});

export default Indexes;
