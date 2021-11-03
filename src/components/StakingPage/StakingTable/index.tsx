import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react';

import StakingTableRow from './StakingTableRow';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { Loader } from '../../index';

import './StakingTable.scss';

interface IStakingTableProps {
  ydrPrice: string;
}

const StakingTable: React.FC<IStakingTableProps> = observer(({ ydrPrice }) => {
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
          <div className="staking-table_header__cell">APR</div>
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell" />
        </div>
        <div className="staking-table_body">
          {+stakesCount ? (
            new Array(+stakesCount)
              .fill(1)
              .map((el, i) => <StakingTableRow index={i} ydrPrice={ydrPrice} />)
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </section>
  );
});

export default StakingTable;
