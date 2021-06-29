import React from 'react';
import SmallTableCard from '../../SmallTableCard/index';

import { Button } from '../../index';

import './StakingStatistics.scss';

const exampleData = [
  {
    tokenName: 'Token 1',
    headerTitle: 'Token',
    data: [
      ['Month', '3'],
      ['End date', '01.07.2021'],
      ['Already staked', '5.000'],
      ['Rewards availavle to withdraw', '0'],
      ['Already withdrawn rewards', '10'],
      ['Estimated rewards', '22'],
    ],
  },
  {
    tokenName: 'Token 1',
    headerTitle: 'Token',
    data: [
      ['Month', '3'],
      ['End date', '01.07.2021'],
      ['Already staked', '5.000'],
      ['Rewards availavle to withdraw', '0'],
      ['Already withdrawn rewards', '10'],
      ['Estimated rewards', '22'],
    ],
  },
];

const StakingStatistics: React.FC = () => {
  return (
    <section className="section section--admin staking-statistics">
      <h2 className="section__title text-outline">Staking Statistics</h2>

      <div className="staking-statistics__btn-row">
        <Button className="staking-statistics__btn">Harvest</Button>
        <Button className="staking-statistics__btn">Harvest and unstake</Button>
      </div>
      <div className="staking-statistics-table__big">
        <div className="staking-statistics-table">
          <div className="staking-statistics-table__row staking-statistics-table__row--head">
            <div className="staking-statistics-table__col">Token</div>
            <div className="staking-statistics-table__col">Month</div>
            <div className="staking-statistics-table__col">End date</div>
            <div className="staking-statistics-table__col">Already staked</div>
            <div className="staking-statistics-table__col">
              Rewards <br /> available to withdraw
            </div>
            <div className="staking-statistics-table__col">Already withdrawn rewards</div>
            <div className="staking-statistics-table__col">Estimated rewards</div>
          </div>

          <div className="staking-statistics-table__content">
            <div className="staking-statistics-table__row">
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__token">Token 1</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__time">3</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__date">01.07.2021</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">5,000</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">0</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">10</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">0</div>
              </div>
            </div>

            <div className="staking-statistics-table__row">
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__token">Token 1</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__time">3</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__date">01.07.2021</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">5,000</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">0</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">10</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">0</div>
              </div>
            </div>

            <div className="staking-statistics-table__row">
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__token">Token 1</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__time">3</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__date">01.07.2021</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">5,000</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">0</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">10</div>
              </div>
              <div className="staking-statistics-table__col">
                <div className="staking-statistics-table__value">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* marginBottom нужен, чтобы выравнить таблицу внизу, тк карточки наславиваются друг на друга через position: relative */}
      <div
        className="staking-statistics-table__small"
        style={{ marginBottom: (exampleData.length - 1) * -15 }}
      >
        {exampleData.map((data, index) => (
          <SmallTableCard {...data} index={index} />
        ))}
      </div>
    </section>
  );
};

export default StakingStatistics;
