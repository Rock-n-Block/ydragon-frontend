import React, { useCallback, useEffect, useState } from 'react';
import SmallTableCard from '../SmallTableCard/index';

import { Button, Table } from '../index';
import SmallTableCard from '../SmallTableCard/index';

import './StakingStatistics.scss';
import { indexesApi } from '../../services/api';
import moment from 'moment';
import BigNumber from 'bignumber.js/bignumber';

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
interface IStakingStat {
  months: number;
  end_date: string | Date;
  staked: number | string;
  reward: number | string;
  name: string;
  dividends: number | string;
}

const StakingStatistics: React.FC = () => {
  const [dataSource, setDataSource] = useState<any[]>([]);
  const columns: any[] = [
    {
      title: 'Token',
      dataIndex: 'token',
      key: 'token',
      render: (item: any) => (
        <div className="table__col-with-logo">
          <span className="table__col-with-logo__text">{item}</span>
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]);
  const selectRow = (record: any) => {
    setSelectedRowKeys([record.key]);
  };
  const onSelectedRowKeysChange = (selectedRow: any) => {
    setSelectedRowKeys(selectedRow);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectedRowKeysChange,
  };

  const getStakingStatistic = useCallback(() => {
    indexesApi
      .getStakingStatistic(localStorage.yd_address)
      .then(({ data }) => {
        const newData = data['binance-smart-chain'].map((stake: IStakingStat, index: number) => {
          return {
            key: index,
            token: stake.name,
            month: stake.months,
            endDate: moment(stake.end_date).format('MM.DD.YYYY'),
            staked: new BigNumber(stake.staked).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
            availableRewards: new BigNumber(stake.reward)
              .dividedBy(new BigNumber(10).pow(18))
              .toFixed(5),
            withdrawnRewards: 'In progress...',
            estimatedRewards: new BigNumber(stake.dividends)
              .dividedBy(new BigNumber(10).pow(18))
              .toFixed(5),
          };
        });
        setDataSource(newData);
      })
      .catch((error) => {
        const { response } = error;
        console.log('Error in getting staking stat', response);
      });
  }, []);

  useEffect(() => {
    getStakingStatistic();
  }, [getStakingStatistic]);
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
      <Table
        rowSelection={{
          type: 'radio',
          ...rowSelection,
        }}
        onRow={(record) => ({
          onClick: () => {
            selectRow(record);
          },
        })}
        dataSource={dataSource}
        columns={columns}
        className="staking-statistics-table__big"
      />
    </section>
  );
};

export default StakingStatistics;
