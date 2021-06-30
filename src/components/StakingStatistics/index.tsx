import React, { useEffect, useState, useCallback } from 'react';
import SmallTableCard from '../SmallTableCard/index';

import { useMst } from '../../store/store';
import { indexesApi } from '../../services/api';

import { Button, Table } from '../index';

import './StakingStatistics.scss';

const exampleData = [
  {
    tokenName: 'Token 1',
    headerTitle: 'Token',
    data: [
      ['Month', '3'],
      ['End date', '01.07.2021'],
      ['Already staked', '5.000'],
      ['Rewards availavle to withdraw', '0'],
      ['Already withdrawn rewards', '10'],
      ['Estimated rewards', '22'],
    ],
  },
  {
    tokenName: 'Token 1',
    headerTitle: 'Token',
    data: [
      ['Month', '3'],
      ['End date', '01.07.2021'],
      ['Already staked', '5.000'],
      ['Rewards availavle to withdraw', '0'],
      ['Already withdrawn rewards', '10'],
      ['Estimated rewards', '22'],
    ],
  },
];

const exampleDataSource = [
  {
    key: 1,
    token: {
      image:
        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 31 31'%3E%3Cpath fill='%238594BE' d='M31 15.5C31 24.06 24.06 31 15.5 31 6.94 31 0 24.06 0 15.5 0 6.94 6.94 0 15.5 0 24.06 0 31 6.94 31 15.5z'/%3E%3Cpath fill='%23fff' d='M15.309 8.611l-.097.328v9.529l.097.096 4.423-2.614-4.423-7.339z'/%3E%3Cpath fill='%23fff' d='M15.31 8.611l-4.424 7.339 4.423 2.614V8.611zM15.31 19.835l-.055.067v3.394l.054.159 4.426-6.233-4.426 2.613z'/%3E%3Cpath fill='%23fff' d='M15.309 23.455v-3.62l-4.423-2.613 4.423 6.233z'/%3E%3C/svg%3E",
      name: 'Index Token',
    },
    month: 3,
    endDate: '01.04.2021',
    staked: '5,000',
    availableRewards: '9',
    withdrawnRewards: '9',
    estimatedRewards: '9',
  },
];

const StakingStatistics: React.FC = () => {
  const { user } = useMst();
  const [userAdress, setUserAdress] = useState(user.address);

  // при первом рендере изначально user.adress пустой, поэтому такой костылик
  useEffect(() => {
    if (!userAdress) {
      setTimeout(() => {
        setUserAdress(user.address);
      }, 1000);
    }
  }, [user.address, userAdress]);

  const getStakingIndexes = useCallback(async (address: string) => {
    try {
      const res = await indexesApi.getStakingIndexes(address);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    if (userAdress) {
      getStakingIndexes(userAdress);
    }
  }, [getStakingIndexes, userAdress]);

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
      <div className="staking-statistics-table__big">
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
      </div>
      {/* marginBottom нужен, чтобы выравнить таблицу внизу, тк карточки наславиваются друг на друга через position: relative */}
      <div
        className="staking-statistics-table__small"
        style={{ marginBottom: (exampleData.length - 1) * -15 }}
      >
        {exampleData.map((data, index) => (
          <SmallTableCard hoverFeature {...data} index={index} />
        ))}
      </div>
      <Table dataSource={exampleDataSource} columns={columns} />
    </section>
  );
};

export default StakingStatistics;
