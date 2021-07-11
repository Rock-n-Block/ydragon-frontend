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
        {('up' === diff[0]) && ('0.0' !== diff[1]) ? <img src={arrowUp} alt="arrow up" /> : null}
        {('down' === diff[0]) ? <img src={arrowDown} alt="arrow down" /> : null}
        {new BigNumber(diff[1]).toFixed(2)}%
      </div>
    </div>
  </div>
);

export default PriceDifferenceBag;
