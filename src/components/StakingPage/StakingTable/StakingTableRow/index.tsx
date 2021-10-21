import React, { useState } from 'react';
import cn from 'classnames';

import { Button } from '../../../index';

import './StakingTableRow.scss';

import arrowDownIcon from '../../../../assets/img/icons/arrow-down.svg';
import logoExample1 from '../../../../assets/img/staking-page/logo-example-1.svg';

const StakingTableRow: React.FC = () => {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <div className="staking-table_row">
      <div className="staking-table_row__top">
        <div className="staking-table_row__cell staking-table_row__cell--logo">
          <div className="staking-table_row__cell__logo">
            <div className="staking-table_row__cell__logo__icon">
              <img src={logoExample1} alt="token logo" />
            </div>
            <div className="staking-table_row__cell__logo__info">
              <p>YDR</p>
              <p>Ydragon</p>
            </div>
          </div>
        </div>
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">balance</div>
          <div className="staking-table_row__cell__value text-MER">$43.02</div>
        </div>
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">deposited</div>
          <div className="staking-table_row__cell__value text-MER">3,000.53 YDR</div>
        </div>
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">your rewards</div>
          <div className="staking-table_row__cell__value text-gradient">42 YDR</div>
        </div>
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">tvl</div>
          <div className="staking-table_row__cell__value text-MER">$160,000</div>
        </div>
        <div className="staking-table_row__cell">
          <Button className="staking-table_row__cell--button">Get YDR</Button>
        </div>
        <div
          className={cn('staking-table_row__cell staking-table_row__cell--arrow', {
            'staking-table_row__cell--arrow--active': isOpened,
          })}
        >
          <button type="button" onClick={() => setIsOpened((prev) => !prev)}>
            <img src={arrowDownIcon} alt="arrow down" />
          </button>
        </div>
      </div>
      {/* ==============BOTTOM MARKUP================= */}
      <div
        className={cn('staking-table_row__bottom', {
          'staking-table_row__bottom--opened': isOpened,
        })}
      >
        <div className="staking-table_row__bottom__inner">
          <div className="staking-table_row__bottom__cell">
            <div className="staking-table_row__bottom__cell__title">
              Wallet: <span className="text-gradient"> 0.0000 LP</span>
            </div>
            <div className="staking-table_row__bottom__cell__input">
              <input placeholder="0.0" type="text" />
            </div>
            <Button colorScheme="blue" className="staking-table_row__bottom__cell__button">
              Stake
            </Button>
          </div>
          <div className="staking-table_row__bottom__cell">
            <div className="staking-table_row__bottom__cell__title">
              Deposited: <span className="text-gradient">0.0000 LP</span>
            </div>
            <div className="staking-table_row__bottom__cell__input">
              <input placeholder="0.0" type="text" />
            </div>
            <Button colorScheme="blue" className="staking-table_row__bottom__cell__button">
              Unstake
            </Button>
          </div>
          <div className="staking-table_row__bottom__cell">
            <div className="staking-table_row__bottom__cell__title">
              Rewards: <span className="text-gradient">21.00 YDR</span>
            </div>
            <div className="staking-table_row__bottom__cell__logo">
              <img src={logoExample1} alt="token logo" />
            </div>
            <Button colorScheme="blue" className="staking-table_row__bottom__cell__button">
              Harvest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakingTableRow;
