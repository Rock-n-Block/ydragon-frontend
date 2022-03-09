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
  const {
    networks,
    user: { address },
  } = useMst();

  const [stakesCount, setStakesCount] = useState<number | null>(null);

  const getStakesCount = useCallback(() => {
    walletConnector.walletService
      .getStakesCount(networks.getCurrNetwork()?.staking_address ?? '')
      .then((count: string) => {
        setStakesCount(+count || 0);
      });
  }, [networks, walletConnector.walletService]);

  useEffect(() => {
    if (networks.networksList.length && address) {
      getStakesCount();
    }
  }, [address, getStakesCount, networks.networksList.length]);

  if (!address) {
    return null;
  }
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
          {networks.getCurrNetwork()?.old_staking_address &&
            new Array(2).fill(1).map((el, i) => (
              // eslint-disable-next-line
              <StakingTableRow key={`StakingTableRow_${i}`} index={i} ydrPrice={ydrPrice} old />
            ))}
          {typeof stakesCount === 'number' ? (
            new Array(+stakesCount)
              .fill(1)
              // eslint-disable-next-line
              .map((el, i) => (
                <StakingTableRow key={`StakingTableRow_${i + 2}`} index={i} ydrPrice={ydrPrice} />
              ))
          ) : (
            <Loader loading />
          )}
        </div>
      </div>
    </section>
  );
});

export default StakingTable;
