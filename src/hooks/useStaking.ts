import { useState, useCallback, useEffect } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { useWalletConnectorContext } from '../services/walletConnect';
import { fromWeiToNormal } from '../utils/fromWeiToNormal';
import { indexesApi, coingeckoApi } from '../services/api';

import configABI from '../services/web3/config_ABI';

export const useStaking = (indexId: number, userAddress: string, stakingAddress: string) => {
  // read methods first
  const walletConnect = useWalletConnectorContext();

  // main info
  const [isAllowance, setIsAllowance] = useState(false);
  const [stakedTokenAdr, setStakedTokenAdr] = useState('');
  const [tokenInfoFromBack, setTokenInfoFromBack] = useState({ link: '', priceInUsd: '' });

  // index info
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [deposited, setDeposited] = useState('');
  const [totalStaked, setTotalStaked] = useState('');
  const [rewards, setRewards] = useState('');
  const [balance, setBalance] = useState('');

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
    const stakedTokenAdress = await getStakedTokenAdress(indexId);
    const indexName = await walletConnect.metamaskService.getTokenName(stakedTokenAdress);
    let indexSymbol: string = await walletConnect.metamaskService.getTokenSymbol(stakedTokenAdress);

    try {
      const tokensAddresses = await walletConnect.metamaskService.getTokensFromLPToken(
        stakedTokenAdress,
      );

      const firstSymbol = await walletConnect.metamaskService.getTokenSymbol(tokensAddresses[0]);
      const secondSymbol = await walletConnect.metamaskService.getTokenSymbol(tokensAddresses[1]);

      indexSymbol = `${firstSymbol} / ${secondSymbol} LP`;
    } catch (error) {
      console.log(error);
    }

    return { indexSymbol: indexSymbol.toUpperCase(), indexName };
  }, [walletConnect.metamaskService, getStakedTokenAdress, indexId]);

  const getBalanceOfUser = useCallback(async () => {
    const stakedTokenAdress = await getStakedTokenAdress(indexId);
    const userBalance: string = await walletConnect.metamaskService.getBalanceOf(stakedTokenAdress);

    return userBalance;
  }, [walletConnect.metamaskService, indexId, getStakedTokenAdress]);

  const getTokenPriceInUsd = useCallback(
    async (indexID: string, isYdr?: boolean, isLp?: boolean) => {
      try {
        if (isYdr) {
          const response = await coingeckoApi.getYdrCurrentPrice();
          return {
            link: '/ydrtoken',
            priceInUsd: response.data.ydragon.usd,
          };
        }

        if (isLp) {
          return {
            link: '/',
            priceInUsd: '1',
          };
        }

        const response = await indexesApi.getIndexInfoByIndexAddress(indexID);
        return {
          link: `/index/${response.data.id}`,
          priceInUsd: response.data.price,
        };
      } catch (error) {
        return {
          link: '',
          priceInUsd: '1',
        };
      }
    },
    [],
  );

  // STAKE TOKENS
  const deposit = useCallback(
    async (amount: string) => {
      const res = await walletConnect.metamaskService.deposit(stakedTokenAdr, amount);
      if (res.status) {
        setBalance((prev) => new BigNumber(prev).minus(amount).toString());
        setDeposited((prev) => new BigNumber(prev).plus(amount).toString());
        setTotalStaked((prev) => new BigNumber(prev).plus(amount).toString());
      }
    },
    [walletConnect.metamaskService, stakedTokenAdr, setDeposited, setBalance, setTotalStaked],
  );

  // CLAIM REWORD
  const claimReward = useCallback(
    async (amount: string, ind: string | number) => {
      const res = await walletConnect.metamaskService.claimReward(ind);
      if (res.status) {
        setRewards('0');
        console.log(amount);
        // setBalance((prev) => new BigNumber(prev).plus(amount).toString());
      }
    },
    [walletConnect.metamaskService, setRewards],
  );

  // WITHDRAW
  const withdraw = useCallback(
    async (tokenAdress: string, amount: string) => {
      const res = await walletConnect.metamaskService.withdraw(tokenAdress, amount);
      if (res.status) {
        setDeposited((prev) => new BigNumber(prev).minus(amount).toString());
        setBalance((prev) => new BigNumber(prev).plus(amount).toString());
        setTotalStaked((prev) => new BigNumber(prev).minus(amount).toString());
      }
    },
    [walletConnect.metamaskService, setDeposited, setBalance, setTotalStaked],
  );

  const approve = useCallback(async () => {
    const data = await walletConnect.metamaskService.approve(stakedTokenAdr, stakingAddress);
    if (data.status) {
      setIsAllowance(true);
    }
  }, [walletConnect.metamaskService, stakedTokenAdr, setIsAllowance, stakingAddress]);

  useEffect(() => {
    // INDEX NAME AND SYMBOL
    getStakeSymbolAndName().then((data) => {
      setName(data.indexName);
      setSymbol(data.indexSymbol);
    });

    // USER BALANCE IN THE WALLET
    getBalanceOfUser().then((userBalance) => setBalance(fromWeiToNormal(userBalance)));

    // USER STAKED AMOUNT
    walletConnect.metamaskService
      .getUserStakedAmount(userAddress, indexId)
      .then((data: string) => setDeposited(fromWeiToNormal(data)));

    // TOTAL STAKED AMOUNT
    walletConnect.metamaskService
      .getTotalStaked(indexId)
      .then((data: string) => setTotalStaked(fromWeiToNormal(data)));

    // USER REWARDS
    walletConnect.metamaskService
      .getUserRewards(userAddress, indexId)
      .then((data: string) => setRewards(fromWeiToNormal(data)));

    // ALLOWANCE
    walletConnect.metamaskService
      .checkAllowanceById(stakedTokenAdr, configABI.MAIN.ABI, stakingAddress)
      .then((data: boolean) => {
        setIsAllowance(data);
      });

    // STAKED TOKEN ADDRESS
    getStakedTokenAdress(indexId).then((data) => {
      setStakedTokenAdr(data);

      getTokenPriceInUsd(data, symbol === 'YDR').then((tokenInfo) => {
        setTokenInfoFromBack(tokenInfo);
      });
    });
  }, [
    getStakeSymbolAndName,
    getBalanceOfUser,
    walletConnect.metamaskService,
    indexId,
    userAddress,
    getStakedTokenAdress,
    getTokenPriceInUsd,
    symbol,
    stakedTokenAdr,
    stakingAddress,
  ]);

  return {
    symbol,
    name,
    deposited,
    totalStaked,
    rewards,
    balance,
    stakedTokenAdr,
    tokenInfoFromBack,
    isAllowance,
    claimReward,
    setDeposited,
    setBalance,
    setTotalStaked,
    setRewards,
    setIsAllowance,
    deposit,
    approve,
    withdraw,
  };
};
