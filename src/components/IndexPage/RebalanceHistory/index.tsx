import React from 'react';
import moment from 'moment';

import './RebalanceHistory.scss';

interface RebalanceHistoryProps {
  lastRebalance?: Date | string;
}

const RebalanceHistory: React.FC<RebalanceHistoryProps> = ({ lastRebalance }) => {
  return (
    <div className="index-rebalance-history">
      <div className="index-rebalance-history__title">Time Since Last Rebalance</div>
      {lastRebalance ? (
        <div className="index-rebalance-history__value">{moment(lastRebalance).fromNow()}</div>
      ) : (
        <div className="index-rebalance-history__value">Index hasn&apos;t been rebalanced yet</div>
      )}
    </div>
  );
};

export default RebalanceHistory;
