import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import BigNumber from 'bignumber.js/bignumber';

import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';
import { ProviderRpcError } from '../../types/errors';
import { Button, Spinner } from '../index';
import { InputNumber } from '../Input';
import StakeItem, { IStakeItem } from '../StakeItem';

import './Stake.scss';

export interface IStakeToken {
  address: string;
  name: string;
  symbol: string;
  balance: string;
}
interface StakeProps {
  tokens: IStakeToken[];
  propsLoading: boolean;
}
const Stake: React.FC<StakeProps> = ({ tokens, propsLoading }) => {
  const walletConnector = useWalletConnectorContext();
  const { modals } = useMst();
  const [tokensList, setTokensList] = useState<IStakeItem[]>([] as IStakeItem[]);
  const [activeStakeIndex, setActiveStakeIndex] = useState<number>(0);
  const [stakeValue, setStakeValue] = useState<string>('');
  const [intervalIndex, setIntervalIndex] = useState<0 | 1 | 2>(0);
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState<boolean>(propsLoading);
  const handleStakeItemClick = (index: number) => {
    setActiveStakeIndex(index);
  };
  const handleAllClick = () => {
    setStakeValue(tokensList[activeStakeIndex].available);
  };
  const handleStakeValueChange = (value: any) => {
    setStakeValue(value || '');
  };
  const handleRadioChange = (e: any) => {
    setIntervalIndex(e.target.value);
  };
  const handleStakeStart = () => {
    setLoading(true);
    walletConnector.metamaskService
      .startStake(tokens[activeStakeIndex].address, stakeValue, intervalIndex)
      .then(() => {
        modals.info.setMsg('Success', 'Staking has been started', 'success');
      })
      .catch((error: ProviderRpcError) => {
        const { message } = error;
        modals.info.setMsg('Error', `Stacking error ${message}`, 'error');
      })
      .finally(() => setLoading(false));
  };
  const approveToken = () => {
    setLoading(true);
    walletConnector.metamaskService
      .approveStake(tokens[activeStakeIndex].address)
      .then(() => {
        setIsAllowed(!isAllowed);
      })
      .catch((error: ProviderRpcError) => {
        const { message } = error;
        modals.info.setMsg('Error', `Approve token error ${message}`, 'error');
      })
      .finally(() => setLoading(false));
  };
  const checkAllowance = useCallback(() => {
    setLoading(true);
    walletConnector.metamaskService
      .checkStakingAllowance(tokens[activeStakeIndex].address)
      .then((result: boolean) => {
        setIsAllowed(result);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('stake allowance error', response);
      })
      .finally(() => setLoading(false));
  }, [walletConnector.metamaskService, tokens, activeStakeIndex]);
  useEffect(() => {
    setLoading(true);
    setTokensList(
      tokens.map((token) => {
        return {
          token: {
            symbol: token.symbol,
            name: token.name,
          },
          available: new BigNumber(token.balance).dividedBy(new BigNumber(10).pow(18)).toFixed(6),
        };
      }),
    );
  }, [tokens]);
  useEffect(() => {
    if (tokens.length) {
      checkAllowance();
    }
  }, [tokens.length, checkAllowance]);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Stake</h2>

      <div className="stake">
        <div className="stake__title">Available to stake</div>

        <div className="stake__content">
          <Spinner loading={loading} />
          {tokensList.map((item, index) => (
            <StakeItem
              key={nextId()}
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
                  value={0}
                  onClick={(e) => handleRadioChange(e)}
                  defaultChecked
                />
                <span className="stake-amount__time-label">1 Month</span>
              </label>

              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="stake-amount__time">
                <input
                  type="radio"
                  name="amount-time"
                  className="stake-amount__time-radio"
                  value={1}
                  onClick={(e) => handleRadioChange(e)}
                />
                <span className="stake-amount__time-label">3 Month</span>
              </label>

              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="stake-amount__time">
                <input
                  type="radio"
                  name="amount-time"
                  className="stake-amount__time-radio"
                  value={2}
                  onClick={(e) => handleRadioChange(e)}
                />
                <span className="stake-amount__time-label">12 Month</span>
              </label>
            </div>
          </div>
        </div>

        <div className="stake__btn-row">
          {isAllowed ? (
            <Button onClick={handleStakeStart}>Stake</Button>
          ) : (
            <Button onClick={approveToken}>Approve</Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Stake;
