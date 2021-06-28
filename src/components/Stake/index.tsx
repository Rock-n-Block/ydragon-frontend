import React from 'react';

import btc from '../../assets/img/tokens/btc.svg';
import { Button, Input } from '../index';

import './Stake.scss';

const Stake: React.FC = () => {
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Stake</h2>

      <div className="stake">
        <div className="stake__title">Available to stake</div>

        <div className="stake__content">
          <div className="stake-item stake-item--active">
            <div className="stake-item__info">
              <img src={btc} alt="" width="36" height="36" className="stake-item__icon" />

              <div className="stake-item__name-wrapper">
                <div className="stake-item__name">Token</div>
                <div className="stake-item__abbr">Token</div>
              </div>
            </div>

            <div className="stake-item__amount">15,235.532.743</div>
          </div>

          <div className="stake-item">
            <div className="stake-item__info">
              <img src={btc} alt="" width="36" height="36" className="stake-item__icon" />

              <div className="stake-item__name-wrapper">
                <div className="stake-item__name">Token</div>
                <div className="stake-item__abbr">Token</div>
              </div>
            </div>

            <div className="stake-item__amount">22,502</div>
          </div>

          <div className="stake-item">
            <div className="stake-item__info">
              <img src={btc} alt="" width="36" height="36" className="stake-item__icon" />

              <div className="stake-item__name-wrapper">
                <div className="stake-item__name">Token</div>
                <div className="stake-item__abbr">Token</div>
              </div>
            </div>

            <div className="stake-item__amount">0,41</div>
          </div>
        </div>

        <div className="stake-amount">
          <div className="stake-amount__title text-gradient">Amount to stake</div>

          <div className="stake-amount__input-wrapper">
            <Input placeholder="0.0" type="number" />

            <span className="stake-amount__all">All Available</span>
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
