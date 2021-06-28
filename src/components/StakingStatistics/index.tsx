import React from 'react';

import { Button, Table } from '../index';

import './StakingStatistics.scss';

const StakingStatistics: React.FC = () => {
  const columns: any[] = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      render: (item: any) => (
        <div className="table__col-with-logo">
          <img src={item.image} className="table__col-with-logo__image" alt={`${item.name} logo`} />
          <span className="table__col-with-logo__text">{item.name}</span>
        </div>
      ),
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      render: (item: any) => <span className="text-gradient">{item}</span>,
    },
    {
      title: 'End date',
      dataIndex: 'endDate',
      key: 'endDate',
    },
    {
      title: 'Already staked',
      dataIndex: 'staked',
      key: 'staked',
    },
    {
      title: 'Rewards available to withdraw',
      dataIndex: 'availableRewards',
      key: 'availableRewards',
    },
    {
      title: 'Already withdrawn rewards',
      dataIndex: 'withdrawnRewards',
      key: 'withdrawnRewards',
    },
    {
      title: 'Estimated rewards',
      dataIndex: 'estimatedRewards',
      key: 'estimatedRewards',
    },
  ];
  return (
    <section className="section section--admin staking-statistics">
      <h2 className="section__title text-outline">Staking Statistics</h2>

      <div className="staking-statistics__btn-row">
        <Button className="staking-statistics__btn" styledType="outline">
          Harvest
        </Button>
        <Button className="staking-statistics__btn" styledType="outline">
          Harvest and unstake
        </Button>
      </div>

      <div className="staking-statistics-table">
        <div className="staking-statistics-table__row staking-statistics-table__row--head">
          <div className="staking-statistics-table__col">Token</div>
          <div className="staking-statistics-table__col">Month</div>
          <div className="staking-statistics-table__col">End date</div>
          <div className="staking-statistics-table__col">Already staked</div>
          <div className="staking-statistics-table__col">
            Rewards <br /> available to withdraw
          </div>
          <div className="staking-statistics-table__col">Already withdrawn rewards</div>
          <div className="staking-statistics-table__col">Estimated rewards</div>
        </div>

        <div className="staking-statistics-table__content">
          <div className="staking-statistics-table__row">
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__token">Token 1</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__time">3</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__date">01.07.2021</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">5,000</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">0</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">10</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">0</div>
            </div>
          </div>

          <div className="staking-statistics-table__row">
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__token">Token 1</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__time">3</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__date">01.07.2021</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">5,000</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">0</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">10</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">0</div>
            </div>
          </div>

          <div className="staking-statistics-table__row">
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__token">Token 1</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__time">3</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__date">01.07.2021</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">5,000</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">0</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">10</div>
            </div>
            <div className="staking-statistics-table__col">
              <div className="staking-statistics-table__value">0</div>
            </div>
          </div>
        </div>
      </div>
      <Table columns={columns} />
    </section>
  );
};

export default StakingStatistics;
