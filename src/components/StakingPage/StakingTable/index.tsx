import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import StakingTableRow from './StakingTableRow';
// import { useWalletConnectorContext } from '../../../services/walletConnect';
// import { useMst } from '../../../store/store';

import './StakingTable.scss';
import { useMst } from '../../../store/store';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { Loader } from '../../index';

interface IStakingTableProps {
  ydrPrice: string;
}

const StakingTable: React.FC<IStakingTableProps> = observer(({ ydrPrice }) => {
  const walletConnector = useWalletConnectorContext();
  const { networks } = useMst();

  const [stakesCount, setStakesCount] = useState<number | null>(null);

  const getStakesCount = useCallback(() => {
    walletConnector.walletService
      .getStakesCount(networks.getCurrNetwork()?.staking_address ?? '')
      .then((count: string) => {
        setStakesCount(+count || 0);
      });
  }, [networks, walletConnector.walletService]);

  useEffect(() => {
    if (networks.networksList.length) {
      getStakesCount();
    }
  }, [getStakesCount, networks.networksList.length]);

  return (
    <section className="section">
      <div className="staking-table">
        <div className="staking-table_header">
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell">Wallet</div>
          <div className="staking-table_header__cell">Deposited</div>
          <div className="staking-table_header__cell">Your Rewards</div>
          <div className="staking-table_header__cell">TVL</div>
          <div className="staking-table_header__cell">APR</div>
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell" />
        </div>
        <div className="staking-table_body">
          {new Array(2).fill(1).map((el, i) => (
            // eslint-disable-next-line
            <StakingTableRow key={i} index={i} ydrPrice={ydrPrice} old />
          ))}
          {typeof stakesCount === 'number' ? (
            new Array(+stakesCount)
              .fill(1)
              // eslint-disable-next-line
              .map((el, i) => <StakingTableRow key={i} index={i} ydrPrice={ydrPrice} />)
          ) : (
            <Loader loading />
          )}
        </div>
      </div>
    </section>
  );
});

export default StakingTable;
