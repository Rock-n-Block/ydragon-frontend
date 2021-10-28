import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { rates } from '../../../services/api';
import { numberFormatter } from '../../../utils/numberFormatter';

import './StakingStatistic.scss';

interface ITVLData {
  'binance-smart-chain_tvl': {
    count: number;
    in_dollars: number;
  };

  'ethereum_tvl': {
    count: number;
    in_dollars: number;
  };

  'ydr_tvl': number;
}

const StakingStatistic: React.FC = () => {
  const [tvlData, setTvlData] = useState<ITVLData>({} as ITVLData);

  useEffect(() => {
    rates.getTvl().then((data) => setTvlData(data.data));
  }, []);

  return (
    <section className="section">
      <ul className="staking-statistic-list">
        <li className="staking-statistic-red">
          <div className="staking-statistic-red_title text-MER">Total YDR Staked</div>
          <div className="staking-statistic-red_amount text-MER">51.8 M</div>
          <div className="staking-statistic-red_subamount">($4,854,869.11)</div>
          <div className="staking-statistic-red_subtitle text-MER">
            Circulating <br /> supply staked
          </div>
          <div className="staking-statistic-red_percent text-MER">11.56%</div>
        </li>
        <li className="staking-statistic-dark">
          <div className="staking-statistic-dark_title text-MER">Total Value Locked</div>
          <div className="staking-statistic-dark_amount text-MER text-gradient">
            $2,656,921,515.69
          </div>
          <div className="staking-statistic-dark_prices">
            <div className="staking-statistic-dark_price">
              <div className="staking-statistic-dark_price__title text-MER">
                Binance <br /> Smart Chain
              </div>
              <div className="staking-statistic-dark_price__amount text-MER text-gradient">
                $
                {numberFormatter(
                  +new BigNumber(tvlData['binance-smart-chain_tvl']?.in_dollars).toFixed(0),
                  1,
                )}
              </div>
            </div>
            <div className="staking-statistic-dark_price">
              <div className="staking-statistic-dark_price__title text-MER">Ethereum</div>
              <div className="staking-statistic-dark_price__amount text-MER text-gradient">
                ${numberFormatter(+new BigNumber(tvlData.ethereum_tvl?.in_dollars).toFixed(0), 1)}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default StakingStatistic;
