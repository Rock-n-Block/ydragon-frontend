import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { ratesApi } from '../../../services/api';
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
  'ydr_total_supply': number;
}

interface IYdrPrice {
  ydrPrice: string;
}

const StakingStatistic: React.FC<IYdrPrice> = ({ ydrPrice }) => {
  const [tvlData, setTvlData] = useState<ITVLData>({} as ITVLData);

  useEffect(() => {
    ratesApi.getTvl().then((data) => setTvlData(data.data));
  }, []);

  return (
    <section className="section">
      <ul className="staking-statistic-list">
        <li className="staking-statistic-red">
          <div className="staking-statistic-red_title text-MER">Total YDR Staked</div>
          <div className="staking-statistic-red_amount text-MER">
            {numberFormatter(+new BigNumber(tvlData.ydr_tvl || 0).toString(10), 0)}
          </div>
          <div className="staking-statistic-red_subamount">
            ($ {new BigNumber(tvlData.ydr_tvl || 0).multipliedBy(ydrPrice || 0).toFormat(2)})
          </div>
          <div className="staking-statistic-red_subtitle text-MER">
            Circulating <br /> supply staked
          </div>
          <div className="staking-statistic-red_percent text-MER">
            {new BigNumber(tvlData.ydr_tvl || 0)
              .dividedBy(tvlData.ydr_total_supply || 1)
              .multipliedBy(100)
              .toFormat(2)}
            %
          </div>
        </li>
        <li className="staking-statistic-dark">
          <div className="staking-statistic-dark_title text-MER">Total Value Locked</div>
          <div className="staking-statistic-dark_amount text-MER text-gradient">
            ${' '}
            {new BigNumber(tvlData['binance-smart-chain_tvl']?.in_dollars || 0)
              .plus(tvlData.ethereum_tvl?.in_dollars || 0)
              .toFormat(2)}
          </div>
          <div className="staking-statistic-dark_prices">
            <div className="staking-statistic-dark_price">
              <div className="staking-statistic-dark_price__title text-MER">
                Binance <br /> Smart Chain
              </div>
              <div className="staking-statistic-dark_price__amount text-MER text-gradient">
                $
                {numberFormatter(
                  +new BigNumber(tvlData['binance-smart-chain_tvl']?.in_dollars || 0).toFixed(0),
                  1,
                )}
              </div>
            </div>
            <div className="staking-statistic-dark_price">
              <div className="staking-statistic-dark_price__title text-MER">Ethereum</div>
              <div className="staking-statistic-dark_price__amount text-MER text-gradient">
                $
                {numberFormatter(
                  +new BigNumber(tvlData.ethereum_tvl?.in_dollars || 0).toFixed(0),
                  1,
                )}
              </div>
            </div>
          </div>
        </li>
      </ul>
    </section>
  );
};

export default StakingStatistic;
