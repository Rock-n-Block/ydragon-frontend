import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import StakingTableRow from './StakingTableRow';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';

import './StakingTable.scss';

const StakingTable: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { networks } = useMst();

  const [stakesCount, setStakesCount] = useState(0);

  const getStakesCount = useCallback(() => {
    walletConnector.metamaskService.getStakesCount().then((count: number) => {
      setStakesCount(count);
    });
  }, [walletConnector.metamaskService]);

  useEffect(() => {
    if (networks.currentNetwork) {
      getStakesCount();
    }
  }, [getStakesCount, networks.currentNetwork]);

  return (
    <section className="section">
      <div className="staking-table">
        <div className="staking-table_header">
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell">Balance</div>
          <div className="staking-table_header__cell">Deposited</div>
          <div className="staking-table_header__cell">Your Rewards</div>
          <div className="staking-table_header__cell">TVL</div>
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell" />
        </div>
        <div className="staking-table_body">
          {new Array(stakesCount).fill(1).map((el, i) => (
            <StakingTableRow index={i} />
          ))}
        </div>
      </div>
    </section>
  );
});

export default StakingTable;
