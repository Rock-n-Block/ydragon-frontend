import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import RefreshIcon from '../../assets/img/icons/icon-refresh.svg';
import { indexesApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';
import { ProviderRpcError } from '../../types/errors';
import { Button, Table } from '../index';
import SmallTableCard from '../SmallTableCard/index';

import './StakingStatistics.scss';
import { HarvestModal } from '../Modals';

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

const StakingStatistics: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isUnstake, setIsUnstake] = useState<boolean>(false);
  const { modals, user, networks } = useMst();
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
      .getStakingStatistic(user.address ?? '')
      .then(({ data }) => {
        // TODO: mb broken
        const newData = data[`${networks.currentNetwork}`].map(
          (stake: IStakingStat, index: number) => {
            return {
              key: index,
              id: stake.stake_id,
              token: stake.name,
              month: stake.months,
              endDate: moment(stake.end_date).format('DD.MM.YY'),
              staked: new BigNumber(stake.staked).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
              availableRewards: new BigNumber(stake.available_rewards)
                .dividedBy(new BigNumber(10).pow(18))
                .toFixed(5),
              withdrawnRewards: new BigNumber(stake.withdrawn_rewards)
                .dividedBy(new BigNumber(10).pow(18))
                .toFixed(5),
              estimatedRewards: stake.estimated_rewards
                ? `$${new BigNumber(stake.estimated_rewards)
                    .dividedBy(new BigNumber(10).pow(18))
                    .toFixed(5)}`
                : 'In progress...',
            };
          },
        );
        setDataSource(newData);
      })
      .catch((error) => {
        const { response } = error;
        console.log('Error in getting staking stat', response);
      });
  }, [user.address, networks.currentNetwork]);

  const handleHarvestClick = () => {
    setIsUnstake(false);
    if (dataSource[selectedRowKeys[0]]) modals.harvest.open();
  };
  const handleStakeEndClick = () => {
    setIsUnstake(true);
    if (dataSource[selectedRowKeys[0]]) modals.harvest.open();
  };

  const handleHarvest = useCallback(() => {
    walletConnector.metamaskService
      .harvestStakeItem(dataSource[selectedRowKeys[0]].id)
      .then(() => {
        modals.info.setMsg(
          'Success',
          'Success harvest, you need to wait before the end of transaction for updated table data',
          'success',
        );
        getStakingStatistic();
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `Harvest error ${message}`, 'error');
      });
  }, [
    dataSource,
    selectedRowKeys,
    walletConnector.metamaskService,
    modals.info,
    getStakingStatistic,
  ]);

  const handleStakeEnd = useCallback(() => {
    walletConnector.metamaskService
      .endStake(dataSource[selectedRowKeys[0]].id)
      .then(() => {
        modals.info.setMsg(
          'Success',
          'Success harvest and stake, you need to wait before the end of transaction for updated table data',
          'success',
        );
        getStakingStatistic();
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `Harvest and stake error ${message}`, 'error');
      });
  }, [
    dataSource,
    selectedRowKeys,
    walletConnector.metamaskService,
    modals.info,
    getStakingStatistic,
  ]);

  useEffect(() => {
    if (user.address) {
      getStakingStatistic();
    }
  }, [user.address, getStakingStatistic]);

  return (
    <section className="section section--admin staking-statistics">
      <h2 className="section__title text-outline">
        Staking Statistics
        <Button
          styledType="clear"
          onClick={getStakingStatistic}
          className="staking-statistics__refresh"
        >
          <img src={RefreshIcon} alt="refresh" width="36" height="36" />
        </Button>
      </h2>

      <div className="staking-statistics__btn-row">
        <Button
          className="staking-statistics__btn"
          styledType="outline"
          onClick={handleHarvestClick}
        >
          Harvest
        </Button>
        <Button
          className="staking-statistics__btn"
          styledType="outline"
          onClick={handleStakeEndClick}
        >
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
              ['Estimated rewards', `$${data.estimatedRewards}`],
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
      <HarvestModal isUnstake={isUnstake} onOk={isUnstake ? handleStakeEnd : handleHarvest} />
    </section>
  );
});

export default StakingStatistics;
