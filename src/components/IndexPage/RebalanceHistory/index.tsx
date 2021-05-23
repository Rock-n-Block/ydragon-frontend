import React from 'react';

import './RebalanceHistory.scss';

const RebalanceHistory: React.FC = () => {
  return (
    <div className="index-rebalance-history">
      <div className="index-rebalance-history__title">Time Since Last Rebalance</div>
      <div className="index-rebalance-history__value">9 day</div>
      <div className="index-rebalance-history__info">1 day required</div>
    </div>
  );
};

export default RebalanceHistory;
