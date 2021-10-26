import React, { useState, useCallback, useEffect } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import BigNumber from 'bignumber.js/bignumber';

import { Button, Loader } from '../../../index';
import { useWalletConnectorContext } from '../../../../services/walletConnect';
import { useMst } from '../../../../store/store';
import configABI from '../../../../services/web3/config_ABI';

import './StakingTableRow.scss';

import arrowDownIcon from '../../../../assets/img/icons/arrow-down.svg';
import logoExample1 from '../../../../assets/img/staking-page/logo-example-1.svg';
import { Redirect } from 'react-router';

interface IStakingTableRowProps {
  index: number;
}

const formatAmount = (amount: string, decimals = 18) => {
  return new BigNumber(amount).dividedBy(new BigNumber(10).pow(decimals)).toFormat(2);
};

const StakingTableRow: React.FC<IStakingTableRowProps> = observer(({ index }) => {
  const walletConnect = useWalletConnectorContext();
  const [isOpened, setIsOpened] = useState(false);
  const { user, networks } = useMst();

  // main info
  const [stakedTokenAdr, setStakedTokenAdr] = useState('');
  const [isAllowance, setIsAllowance] = useState(false);

  // inputs
  const [toUnstakeAmount, setToUnstakeAmount] = useState('');
  const [toStakeAmount, setToStakeAmount] = useState('');

  // index info [all numbers in wei]
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [deposited, setDeposited] = useState('');
  const [totalStaked, setTotalStaked] = useState('');
  const [rewards, setRewards] = useState('');
  const [balance, setBalance] = useState('');

  // buttons
  const [isFirstBtnLoad, setIsFirstButtonLoad] = useState(false);
  const [isUnstakeLoad, setIsUnstakeLoad] = useState(false);
  const [isRewardLoad, setIsRewardLoad] = useState(false);

  // staking fabric > get current stake by indexId > get stakedTokenAdress in stake === profit!
  const getStakedTokenAdress = useCallback(
    async (indexCount: number) => {
      const stakeAdress = await walletConnect.metamaskService.getStakeContractByIndex(indexCount);
      const stakedTokenAdress = await walletConnect.metamaskService.getStakedTokenFromStake(
        stakeAdress,
      );
      return stakedTokenAdress;
    },
    [walletConnect.metamaskService],
  );

  const getStakeSymbolAndName = useCallback(async () => {
    const stakedTokenAdress = await getStakedTokenAdress(index);
    const indexSymbol = await walletConnect.metamaskService.getIndexSymbol(stakedTokenAdress);
    const indexName = await walletConnect.metamaskService.getIndexName(stakedTokenAdress);
    return { indexSymbol, indexName };
  }, [walletConnect.metamaskService, getStakedTokenAdress, index]);

  const getBalanceOfUser = useCallback(
    async (userAdress: string) => {
      const stakedTokenAdress = await getStakedTokenAdress(index);
      const userBalance: string = await walletConnect.metamaskService.getUserBalance(
        userAdress,
        stakedTokenAdress,
      );

      return userBalance;
    },
    [walletConnect.metamaskService, index, getStakedTokenAdress],
  );

  const withdraw = useCallback(
    async (tokenAdress: string, amount: string) => {
      try {
        setIsUnstakeLoad(true);
        const res = await walletConnect.metamaskService.withdraw(tokenAdress, amount);
        if (res.status) {
          setDeposited((prev) => String(+prev - +amount * 10 ** 18));
          setBalance((prev) => String(+prev + +amount * 10 ** 18));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsUnstakeLoad(false);
      }
    },
    [walletConnect.metamaskService],
  );

  const approve = useCallback(async () => {
    setIsFirstButtonLoad(true);
    try {
      const data = await walletConnect.metamaskService.approveById(
        stakedTokenAdr,
        networks.networksList[0].staking_address,
      );
      if (data.status) {
        setIsAllowance(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFirstButtonLoad(false);
    }
  }, [networks.networksList, walletConnect.metamaskService, stakedTokenAdr]);

  const deposit = useCallback(
    async (amount: string) => {
      try {
        setIsFirstButtonLoad(true);
        const res = await walletConnect.metamaskService.deposit(stakedTokenAdr, amount);
        if (res.status) {
          setBalance((prev) => String(+prev - +amount * 10 ** 18));
          setDeposited((prev) => String(+prev + +amount * 10 ** 18));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsFirstButtonLoad(false);
      }
    },
    [walletConnect.metamaskService, stakedTokenAdr],
  );

  const claimReward = useCallback(
    async (amount: string, ind: string | number) => {
      try {
        setIsRewardLoad(true);
        const res = await walletConnect.metamaskService.claimReward(ind);
        if (res.status) {
          setRewards('0');
          setBalance((prev) => String(+prev + +amount));
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsRewardLoad(false);
      }
    },
    [walletConnect.metamaskService],
  );

  useEffect(() => {
    // ALLOWANCE
    walletConnect.metamaskService
      .checkAllowanceById(
        stakedTokenAdr,
        configABI.Index.ABI,
        networks.networksList[0].staking_address,
      )
      .then((data: boolean) => {
        setIsAllowance(data);
      });

    // INDEX NAME AND SYMBOL
    getStakeSymbolAndName().then((data) => {
      setName(data.indexName);
      setSymbol(data.indexSymbol);
    });

    // USER BALANCE IN THE WALLET
    getBalanceOfUser(user.address).then((userBalance) => setBalance(userBalance));

    // USER STAKED AMOUNT
    walletConnect.metamaskService
      .getUserStakedAmount(user.address, index)
      .then((data: string) => setDeposited(data));

    // TOTAL STAKED AMOUNT
    walletConnect.metamaskService
      .getTotalStaked(index)
      .then((data: string) => setTotalStaked(data));

    // USER REWARDS
    walletConnect.metamaskService
      .getUserRewards(user.address, index)
      .then((data: string) => setRewards(data));
  }, [
    getStakeSymbolAndName,
    getBalanceOfUser,
    user.address,
    walletConnect.metamaskService,
    index,
    stakedTokenAdr,
    networks.networksList,
  ]);

  useEffect(() => {
    getStakedTokenAdress(index).then((data) => {
      setStakedTokenAdr(data);
    });
  }, [getStakedTokenAdress, index]);

  if (!user.address) {
    return <Redirect to="/" />;
  }

  if (!networks.currentNetwork) return <Loader />;

  // TODO: create skeleton
  if (!symbol || !name || !totalStaked)
    return <div className="staking-table_row staking-table_row--skelet">SKELETON</div>;
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
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">balance</div>
          <div className="staking-table_row__cell__value text-MER">$ {formatAmount(balance)}</div>
        </div>
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">deposited</div>
          <div className="staking-table_row__cell__value text-MER">
            {formatAmount(deposited)} {symbol}
          </div>
        </div>
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">your rewards</div>
          <div className="staking-table_row__cell__value text-gradient">
            {formatAmount(rewards)} {symbol}
          </div>
        </div>
        <div className="staking-table_row__cell">
          <div className="staking-table_row__cell__title">tvl</div>
          <div className="staking-table_row__cell__value text-MER">
            $ {formatAmount(totalStaked)}
          </div>
        </div>
        <div className="staking-table_row__cell">
          <Button className="staking-table_row__cell--button">Get {symbol}</Button>
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
              <span className="text-gradient">
                {formatAmount(balance)} {symbol}
              </span>
            </div>
            <div className="staking-table_row__bottom__cell__input">
              <input
                value={toStakeAmount}
                onChange={(e) => setToStakeAmount(e.target.value)}
                placeholder="0.0"
                type="text"
              />
            </div>
            <Button
              disabled={+toStakeAmount > +balance || !toStakeAmount}
              colorScheme="blue"
              loading={isFirstBtnLoad}
              className="staking-table_row__bottom__cell__button"
              onClick={() => {
                if (isAllowance) {
                  deposit(toStakeAmount);
                } else {
                  approve();
                }
              }}
            >
              {isAllowance ? 'Stake' : 'Approve'}
            </Button>
          </div>
          <div className="staking-table_row__bottom__cell">
            <div className="staking-table_row__bottom__cell__title">
              <p>Deposited:</p>
              <span className="text-gradient">
                {formatAmount(deposited)} {symbol}
              </span>
            </div>
            <div className="staking-table_row__bottom__cell__input">
              <input
                value={toUnstakeAmount}
                onChange={(e) => setToUnstakeAmount(e.target.value)}
                placeholder="0.0"
                type="text"
              />
            </div>
            <Button
              disabled={!toUnstakeAmount || +deposited <= 0 || +toUnstakeAmount > +deposited}
              colorScheme="blue"
              className="staking-table_row__bottom__cell__button"
              onClick={() => withdraw(stakedTokenAdr, toUnstakeAmount.trim())}
              loading={isUnstakeLoad}
            >
              Unstake
            </Button>
          </div>
          <div className="staking-table_row__bottom__cell">
            <div className="staking-table_row__bottom__cell__title">
              <p>Rewards:</p>
              <span className="text-gradient">
                {formatAmount(rewards)} {symbol}
              </span>
            </div>
            <div className="staking-table_row__bottom__cell__logo">
              <img src={logoExample1} alt="token logo" />
            </div>
            <Button
              disabled={+rewards <= 0}
              colorScheme="blue"
              className="staking-table_row__bottom__cell__button"
              loading={isRewardLoad}
              onClick={() => claimReward(rewards, index)}
            >
              Harvest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StakingTableRow;
