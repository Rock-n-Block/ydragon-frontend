import React, { useState } from 'react';

import mockBsc from '../../assets/img/icons/logo-binance.svg';
import { Button } from '../index';
import { InputNumber } from '../Input';
import StakeItem, { IStakeItem } from '../StakeItem';

import './Stake.scss';

const mockStakeItems: IStakeItem[] = [
  {
    token: {
      icon: mockBsc,
      symbol: 'bsc',
      name: 'Binance',
    },
    available: '100',
  },
  {
    token: {
      icon: mockBsc,
      symbol: 'bsc',
      name: 'Binance',
    },
    available: '33',
  },
  {
    token: {
      icon: mockBsc,
      symbol: 'bsc',
      name: 'Binance',
    },
    available: '155',
  },
];

const Stake: React.FC = () => {
  const [activeStakeIndex, setActiveStakeIndex] = useState<number>(0);
  const [stakeValue, setStakeValue] = useState<string>('');
  const handleStakeItemClick = (index: number) => {
    setActiveStakeIndex(index);
  };
  const handleAllClick = () => {
    setStakeValue(mockStakeItems[activeStakeIndex].available);
  };
  const handleStakeValueChange = (e: any) => {
    setStakeValue(e.target.value);
  };
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Stake</h2>

      <div className="stake">
        <div className="stake__title">Available to stake</div>

        <div className="stake__content">
          {mockStakeItems.map((item, index) => (
            <StakeItem
              item={item}
              onClick={() => handleStakeItemClick(index)}
              active={activeStakeIndex === index}
            />
          ))}
        </div>

        <div className="stake-amount">
          <div className="stake-amount__title text-gradient">Amount to stake</div>

          <div className="stake-amount__input-wrapper">
            <InputNumber
              value={stakeValue}
              type="number"
              placeholder="0.0"
              onChange={handleStakeValueChange}
            />
            <span
              className="stake-amount__all"
              onClick={handleAllClick}
              role="button"
              tabIndex={0}
              onKeyDown={handleAllClick}
            >
              All Available
            </span>
          </div>

          <div className="stake-amount__time-row">
            <div className="stake-amount__time-wrapper">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="stake-amount__time">
                <input
                  type="radio"
                  name="amount-time"
                  className="stake-amount__time-radio"
                  defaultChecked
                />
                <span className="stake-amount__time-label">1 Month</span>
              </label>

              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="stake-amount__time">
                <input type="radio" name="amount-time" className="stake-amount__time-radio" />
                <span className="stake-amount__time-label">3 Month</span>
              </label>

              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="stake-amount__time">
                <input type="radio" name="amount-time" className="stake-amount__time-radio" />
                <span className="stake-amount__time-label">12 Month</span>
              </label>
            </div>
          </div>
        </div>

        <div className="stake__btn-row">
          <Button>Approve</Button>
        </div>
      </div>
    </section>
  );
};

export default Stake;
