import React, { useState, useCallback } from 'react';
import { Redirect } from 'react-router';
import cn from 'classnames';
import { observer } from 'mobx-react';
import BigNumber from 'bignumber.js/bignumber';
import Tippy from '@tippyjs/react';

import { Button, Loader } from '../../../index';
import { useMst } from '../../../../store/store';
import { useStaking } from '../../../../hooks/useStaking';
import { formatAmount } from '../../../../utils/formatAmount';
import { handleNumericInput } from '../../../../utils/handleNumericInput';
import StakingTableRowCell from './StakingTableRowCell';

import './StakingTableRow.scss';

import arrowDownIcon from '../../../../assets/img/icons/arrow-down.svg';
import logoExample1 from '../../../../assets/img/staking-page/logo-example-1.svg';

interface IStakingTableRowProps {
  index: number;
  ydrPrice: string;
  old?: boolean;
}

const StakingTableRow: React.FC<IStakingTableRowProps> = observer(
  ({ index, ydrPrice, old = false }) => {
    const [isOpened, setIsOpened] = useState(false);
    const { user, networks } = useMst();

    const {
      symbol,
      name,
      deposited,
      totalStaked,
      rewards,
      balance,
      tokenInfoFromBack,
      isAllowance,
      apr,
      deposit,
      approve,
      withdraw,
    } = useStaking(
      index,
      old,
      user.address,
      networks.getCurrNetwork()?.staking_address || '',
      networks.currentNetwork,
      ydrPrice,
    );

    // inputs
    const [toUnstakeAmount, setToUnstakeAmount] = useState('');
    const [toStakeAmount, setToStakeAmount] = useState('');

    // buttons
    const [isFirstBtnLoad, setIsFirstButtonLoad] = useState(false);
    const [isUnstakeLoad, setIsUnstakeLoad] = useState(false);
    const [isRewardLoad, setIsRewardLoad] = useState(false);

    const withdrawTokens = useCallback(
      async (amount: string) => {
        try {
          setIsUnstakeLoad(true);
          await withdraw(amount);
        } catch (error) {
          console.error(error);
        } finally {
          setIsUnstakeLoad(false);
        }
      },
      [withdraw],
    );

    const approveTokens = useCallback(async () => {
      try {
        setIsFirstButtonLoad(true);
        await approve();
      } catch (error) {
        console.error(error);
      } finally {
        setIsFirstButtonLoad(false);
      }
    }, [approve]);

    const claimRewardTokens = useCallback(async () => {
      try {
        setIsRewardLoad(true);
        await withdraw('0');
      } catch (error) {
        console.error(error);
      } finally {
        setIsRewardLoad(false);
      }
    }, [withdraw]);

    const depositTokens = useCallback(
      async (amount: string) => {
        try {
          setIsFirstButtonLoad(true);
          await deposit(amount);
        } catch (error) {
          console.error(error);
        } finally {
          setIsFirstButtonLoad(false);
        }
      },
      [deposit],
    );

    if (!user.address) {
      return <Redirect to="/" />;
    }

    if (!networks.currentNetwork) return <Loader loading />;

    if (!symbol || !name || !totalStaked)
      return <div className="staking-table_row staking-table_row--skelet" />;

    return (
      <div className="staking-table_row">
        <div className="staking-table_row__top">
          <div className="staking-table_row__cell staking-table_row__cell--logo">
            <div className="staking-table_row__cell__logo">
              <div className="staking-table_row__cell__logo__icon">
                <img src={logoExample1} alt="token logo" />
              </div>
              <div className="staking-table_row__cell__logo__info">
                <p>{symbol}</p>
                <p>{name}</p>
              </div>
            </div>
          </div>

          <StakingTableRowCell title="wallet" value={balance} textType="MER" symbol={symbol} />
          <StakingTableRowCell title="deposited" value={deposited} textType="MER" symbol={symbol} />
          <StakingTableRowCell
            title="your rewards"
            value={rewards}
            textType="gradient"
            symbol="YDR"
          />
          <StakingTableRowCell
            title="tvl"
            value={totalStaked}
            textType="MER"
            symbol="$"
            usdPrice={tokenInfoFromBack.priceInUsd}
          />
          <StakingTableRowCell
            title="APR"
            value={apr?.toString(10) || '00'}
            textType="MER"
            symbol="%"
          />
          <div className="staking-table_row__cell">
            <Button
              link={tokenInfoFromBack.link}
              target={tokenInfoFromBack.link[0] !== '/' ? '_blank' : ''}
              className="staking-table_row__cell--button"
            >
              <span>Get {symbol}</span>
            </Button>
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
                <p>Wallet:</p>
                <Tippy content={formatAmount(balance)}>
                  <span className="text-gradient">
                    {formatAmount(balance)} {symbol}
                  </span>
                </Tippy>
              </div>
              <div className="staking-table_row__bottom__cell__input">
                <input
                  value={toStakeAmount}
                  onChange={(e) => handleNumericInput(e.target.value, setToStakeAmount)}
                  placeholder="0.0"
                  type="text"
                />
                <div
                  role="button"
                  onKeyDown={() => {}}
                  tabIndex={0}
                  onClick={() => setToStakeAmount(new BigNumber(balance).toFixed(18, 1))}
                  className="staking-table_row__bottom__cell__input--max"
                >
                  MAX
                </div>
              </div>
              <Button
                disabled={+toStakeAmount > +balance || (!toStakeAmount && isAllowance)}
                colorScheme="blue"
                loading={isFirstBtnLoad}
                className="staking-table_row__bottom__cell__button"
                onClick={() => {
                  if (isAllowance) {
                    depositTokens(toStakeAmount);
                  } else {
                    approveTokens();
                  }
                }}
              >
                {isAllowance ? 'Stake' : 'Approve'}
              </Button>
            </div>
            <div className="staking-table_row__bottom__cell">
              <div className="staking-table_row__bottom__cell__title">
                <p>Deposited:</p>

                <Tippy content={formatAmount(deposited)}>
                  <span className="text-gradient">
                    {formatAmount(deposited)} {symbol}
                  </span>
                </Tippy>
              </div>
              <div className="staking-table_row__bottom__cell__input">
                <input
                  value={toUnstakeAmount}
                  onChange={(e) => handleNumericInput(e.target.value, setToUnstakeAmount)}
                  placeholder="0.0"
                  type="text"
                />
                <div
                  role="button"
                  onKeyDown={() => {}}
                  tabIndex={0}
                  onClick={() => {
                    setToUnstakeAmount(new BigNumber(deposited).toFixed(18, 1));
                  }}
                  className="staking-table_row__bottom__cell__input--max"
                >
                  MAX
                </div>
              </div>
              <Button
                disabled={!toUnstakeAmount || +deposited <= 0 || +toUnstakeAmount > +deposited}
                colorScheme="blue"
                className="staking-table_row__bottom__cell__button"
                onClick={() => withdrawTokens(toUnstakeAmount.trim())}
                loading={isUnstakeLoad}
              >
                Unstake and harvest
              </Button>
            </div>
            <div className="staking-table_row__bottom__cell">
              <div className="staking-table_row__bottom__cell__title">
                <p>Rewards:</p>
                <Tippy content={formatAmount(rewards, 18)}>
                  <span className="text-gradient">{formatAmount(rewards, 18)} YDR</span>
                </Tippy>
              </div>
              <div className="staking-table_row__bottom__cell__logo">
                <img src={logoExample1} alt="token logo" />
              </div>
              <Button
                disabled={+rewards <= 0}
                colorScheme="blue"
                className="staking-table_row__bottom__cell__button"
                loading={isRewardLoad}
                onClick={() => claimRewardTokens()}
              >
                Harvest
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

export default StakingTableRow;
