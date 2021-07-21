import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import { IIndexStatus, ITokensDiff } from '../../../pages/Admin';
import { Table } from '../../index';
import SmallTableCard from '../../SmallTableCard/index';

import './Rebalance.scss';

interface RebalanceProps extends IIndexStatus {
  tokens: Array<ITokensDiff>;
}

const Rebalance: React.FC<RebalanceProps> = observer(({ tokens }) => {
  const columns: any[] = [
    {
      title: 'Token',
      dataIndex: 'name',
      key: 'name',
      render: (item: any) => (
        <div className="table__col-with-logo">
          <img
            src={item.image}
            className="table__col-with-logo__image"
            alt={`${item.name} logo`}
            width="31"
            height="31"
          />
          <span className="table__col-with-logo__text">{item.name}</span>
        </div>
      ),
    },
    {
      title: 'Quantity per index',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (item: any) => <span className="text-gradient">{item}</span>,
    },
    {
      title: 'Token price',
      dataIndex: 'price',
      key: 'price',
    },
    {
      title: 'Current Price Allocation',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Total price per index',
      dataIndex: 'priceTotal',
      key: 'priceTotal',
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    if (tokens) {
      const newData = tokens.map((token, index) => {
        return {
          key: index,
          name: { image: token.token.image, name: token.token.name },
          quantity: new BigNumber(token.token.count)
            .multipliedBy(new BigNumber(10).pow(-token.token.decimal))
            .toFixed(2),
          price: `$${token.token.price_for_one}`,
          weight: `${new BigNumber(token.token.current_weight).multipliedBy(100).toFixed(2)}%`,
          priceTotal: `$${token.token.price_total}`,
        };
      });
      setDataSource(newData);
    }
  }, [tokens]);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Index rebalance</h2>

      {tokens && (
        <>
          <div className="rebalance-table__big">
            <Table dataSource={dataSource} columns={columns} className="rebalance-table" />
          </div>
          <div className="rebalance-table__small">
            {dataSource.map((data, i) => (
              <SmallTableCard
                headerTitle="Token"
                tokenLogo={data.name.image}
                tokenName={data.name.name}
                data={[
                  ['Quantity per index', data.quantity],
                  ['Token price', data.price],
                  ['Current Price Allocation', data.weight],
                  ['Total price per index', data.priceTotal],
                ]}
                index={i}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
});

export default Rebalance;
