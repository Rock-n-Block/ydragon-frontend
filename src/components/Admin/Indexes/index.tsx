import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { IIndex } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { Sorter } from '../../../utils/sorter';
import { Button, Spinner, Table } from '../../index';

import { IndexCardMobile } from './IndexCardMobile/index';

import './Indexes.scss';

const Indexes: React.FC = observer(() => {
  const { networks, modals } = useMst();
  const [indexes, setIndexes] = useState<Array<IIndex>>();
  const [sorterValue, setSorterValue] = useState<string>('');
  const [ascendent, setAscendent] = useState<boolean>(true);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const switchSort = useCallback(
    (value: string, asc: boolean) => {
      switch (value) {
        case 'created_at': {
          if (indexes) {
            const newData = indexes
              .sort((a, b) =>
                Sorter.DATE(moment(a.created_at).format(), moment(b.created_at).format(), asc),
              )
              .map((curIndex, index) => {
                return {
                  key: index,
                  name: { id: curIndex.id, name: curIndex.name },
                  cap: `$${curIndex.market_cap}`,
                  price: `$${curIndex.price}`,
                  created: moment(new Date(curIndex.created_at)).format('DD.MM.YY'),
                };
              });
            setDataSource(newData);
          }
          break;
        }

        default:
          if (indexes) {
            const newData = indexes
              .sort((a, b) => Sorter.DEFAULT(a, b, asc, value))
              .map((curIndex, index) => {
                return {
                  key: index,
                  name: { id: curIndex.id, name: curIndex.name },
                  cap: `$${curIndex.market_cap}`,
                  price: `$${curIndex.price}`,
                  created: moment(new Date(curIndex.created_at)).format('DD.MM.YY'),
                };
              });
            setDataSource(newData);
          }
          break;
      }
    },
    [indexes],
  );

  const sorter = (item: string) => {
    if (sorterValue === item) {
      switchSort(item, !ascendent);
      setAscendent(!ascendent);
    } else {
      switchSort(item, true);
      setAscendent(true);
    }
    setSorterValue(item);
  };

  const columns: any[] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (item: any) => <Link to={`/admin/index/${item.id}`}>{item.name}</Link>,
      onHeaderCell: () => {
        return {
          className: `indexs-table__sort ${
            sorterValue === 'name' ? `indexs-table__sort${ascendent ? '--up' : ''}` : ''
          }`,
          onClick: () => sorter('name'),
        };
      },
    },
    {
      title: 'Market cap',
      dataIndex: 'cap',
      key: 'cap',
      onHeaderCell: () => {
        return {
          className: `indexs-table__sort ${
            sorterValue === 'market_cap' ? `indexs-table__sort${ascendent ? '--up' : ''}` : ''
          }`,
          onClick: () => sorter('market_cap'),
        };
      },
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (item: any) => <span className="text-MER">{item}</span>,
      onHeaderCell: () => {
        return {
          className: `indexs-table__sort ${
            sorterValue === 'price' ? `indexs-table__sort${ascendent ? '--up' : ''}` : ''
          }`,
          onClick: () => sorter('price'),
        };
      },
    },
    {
      title: 'Created',
      dataIndex: 'created',
      key: 'created',
      onHeaderCell: () => {
        return {
          className: `indexs-table__sort ${
            sorterValue === 'created_at' ? `indexs-table__sort${ascendent ? '--up' : ''}` : ''
          }`,
          onClick: () => sorter('created_at'),
        };
      },
    },
  ];

  const getIndexes = useCallback(() => {
    setLoading(true);
    indexesApi
      .getAdminIndexes()
      .then(({ data }) => {
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
    if (networks.currentNetwork) {
      getIndexes();
    }
  }, [getIndexes, networks.currentNetwork]);
  useEffect(() => {
    if (indexes) {
      const newData = indexes.map((curIndex, index) => {
        return {
          key: index,
          name: { id: curIndex.id, name: curIndex.name },
          cap: `$${curIndex.market_cap}`,
          price: `$${curIndex.price}`,
          created: moment(new Date(curIndex.created_at)).format('DD.MM.YY'),
        };
      });
      setDataSource(newData);
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
