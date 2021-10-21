import React from 'react';

import StakingTableRow from './StakingTableRow';

import './StakingTable.scss';

const StakingTable: React.FC = () => {
  return (
    <section className="section">
      <div className="staking-table">
        <div className="staking-table_header">
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell">Balance</div>
          <div className="staking-table_header__cell">Deposited</div>
          <div className="staking-table_header__cell">Your Awards</div>
          <div className="staking-table_header__cell">TVL</div>
          <div className="staking-table_header__cell" />
          <div className="staking-table_header__cell" />
        </div>
        <div className="staking-table_body">
          <StakingTableRow />
          <StakingTableRow />
          <StakingTableRow />
          <StakingTableRow />
        </div>
      </div>
    </section>
  );
};

export default StakingTable;
