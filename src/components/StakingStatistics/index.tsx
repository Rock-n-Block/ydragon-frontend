import React, { useCallback, useEffect, useState } from 'react';

import { indexesApi } from '../../services/api';

import { Button, Table } from '../index';
import SmallTableCard from '../SmallTableCard/index';

import './StakingStatistics.scss';
import moment from 'moment';
import BigNumber from 'bignumber.js/bignumber';
import { useWalletConnectorContext } from '../../services/walletConnect';
import nextId from 'react-id-generator';

interface IStakingStat {
  months: number;
  end_date: string | Date;
  staked: number | string;
  stake_id: number;
  estimated_rewards: number | string;
  withdrawn_rewards: number | string;
  available_rewards: number | string;
  name: string;
}

const StakingStatistics: React.FC = () => {
  const walletConnector = useWalletConnectorContext();
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

  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([0]);
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
            id: stake.stake_id,
            token: stake.name,
            month: stake.months,
            endDate: moment(stake.end_date).format('MM.DD.YYYY'),
            staked: new BigNumber(stake.staked).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
            availableRewards: new BigNumber(stake.available_rewards)
              .dividedBy(new BigNumber(10).pow(18))
              .toFixed(5),
            withdrawnRewards: new BigNumber(stake.withdrawn_rewards)
              .dividedBy(new BigNumber(10).pow(18))
              .toFixed(5),
            estimatedRewards: stake.estimated_rewards
              ? new BigNumber(stake.estimated_rewards)
                  .dividedBy(new BigNumber(10).pow(18))
                  .toFixed(5)
              : 'In progress...',
          };
        });
        setDataSource(newData);
      })
      .catch((error) => {
        const { response } = error;
        console.log('Error in getting staking stat', response);
      });
  }, []);

  const handleHarvest = useCallback(() => {
    walletConnector.metamaskService
      .harvestStakeItem(dataSource[selectedRowKeys[0]].id)
      .then((data: any) => {
        console.log('harvest', data);
      })
      .catch((err: any) => {
        console.log('harvest', err);
      });
  }, [dataSource, selectedRowKeys, walletConnector.metamaskService]);

  const handleStakeEnd = useCallback(() => {
    walletConnector.metamaskService
      .endStake(dataSource[selectedRowKeys[0]].id)
      .then((data: any) => {
        console.log('stakeEnd', data);
      })
      .catch((err: any) => {
        console.log('stakeEnd', err);
      });
  }, [dataSource, selectedRowKeys, walletConnector.metamaskService]);

  useEffect(() => {
    getStakingStatistic();
  }, [getStakingStatistic]);

  return (
    <section className="section section--admin staking-statistics">
      <h2 className="section__title text-outline">Staking Statistics</h2>

      <div className="staking-statistics__btn-row">
        <Button className="staking-statistics__btn" styledType="outline" onClick={handleHarvest}>
          Harvest
        </Button>
        <Button className="staking-statistics__btn" styledType="outline" onClick={handleStakeEnd}>
          Harvest and unstake
        </Button>
      </div>
      {/* marginBottom нужен, чтобы выравнить таблицу внизу, тк карточки наславиваются друг на друга через position: relative */}
      <div
        className="staking-statistics-table__small"
        style={{ marginBottom: (dataSource.length - 1) * -15 }}
      >
        {dataSource.map((data, index) => (
          <SmallTableCard
            key={nextId()}
            tokenName={data.token}
            headerTitle="Token"
            data={[
              ['Month', data.month],
              ['End date', data.endDate],
              ['Already staked', data.staked],
              ['Rewards available to withdrawn', data.availableRewards],
              ['Already withdrawn rewards', data.withdrawnRewards],
              ['Estimated rewards', data.estimatedRewards],
            ]}
            index={index}
            hoverFeature
            originData={data}
            onSelect={selectRow}
            isSelected={selectedRowKeys[0] === data.key}
          />
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
