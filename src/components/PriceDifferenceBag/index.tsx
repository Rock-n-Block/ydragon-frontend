import React from 'react';
import BigNumber from 'bignumber.js/bignumber';

import arrowDown from '../../assets/img/chart/arrow-down.svg';
import arrowUp from '../../assets/img/chart/arrow-up.svg';

interface IPriceDifferenceBagProps {
  price: number;
  diff: Array<string | number>;
}

const PriceDifferenceBag: React.FC<IPriceDifferenceBagProps> = ({ price, diff }) => (
  <div className="chart-panel-title">
    ${new BigNumber(price).toFixed(6)}
    <div className="diff">
      <div className={`diff-${diff[0]}`}>
        {diff[0] === 'up' && diff[1] !== '0.0' ? (
          <img src={arrowUp} alt="arrow up" width="10" height="10" />
        ) : null}
        {diff[0] === 'down' ? (
          <img src={arrowDown} alt="arrow down" width="10" height="10" />
        ) : null}
        {new BigNumber(diff[1]).toFixed(2)}%
      </div>
    </div>
  </div>
);

export default PriceDifferenceBag;
