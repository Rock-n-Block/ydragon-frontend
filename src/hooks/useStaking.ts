import config, { BLOCKS_PER_YEAR } from '../config/index';
import { useState, useCallback, useEffect } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { useWalletConnectorContext } from '../services/walletConnect';
import { fromWeiToNormal } from '../utils/fromWeiToNormal';
import { indexesApi } from '../services/api';
import txToast from '../components/ToastWithTxHash';

import configABI from '../services/web3/config_ABI';
import { chainsEnum } from '../types';

const { SWAP_URLS } = config;

export const useStaking = (
  indexId: number,
  userAddress: string,
  stakingAddress: string,
  currentNetwork: string,
  ydrPrice: string,
) => {
  const walletConnect = useWalletConnectorContext();

  // main info
  const [isAllowance, setIsAllowance] = useState(false);
  const [stakedTokenAdr, setStakedTokenAdr] = useState('');
  const [stakeAddress, setStakeAddress] = useState('');
  const [tokenInfoFromBack, setTokenInfoFromBack] = useState({ link: '', priceInUsd: '' });
  const [apr, setApr] = useState<number | null>(null);

  // index info
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [deposited, setDeposited] = useState('');
  const [totalStaked, setTotalStaked] = useState('');
  const [rewards, setRewards] = useState('');
  const [balance, setBalance] = useState('');
  const [isTokenLp, setIsLp] = useState(false);

  // additional info
  const [lpTokenFirst, setLpTokenFirst] = useState('');
  const [lpTokenSecond, setLpTokenSecond] = useState('');

  // staking fabric > get current stake by indexId > get stakedTokenAdress in stake === profit!
  const getStakedTokenAdress = useCallback(
    async (indexCount: number) => {
      const stakeAdress = await walletConnect.walletService.getStakeContractByIndex(indexCount);
      const stakedTokenAdress = await walletConnect.walletService.getStakedTokenFromStake(
        stakeAdress,
      );
      return stakedTokenAdress;
    },
    [walletConnect.walletService],
  );

  const getStakeSymbolAndName = useCallback(async () => {
    const stakedTokenAdress = await getStakedTokenAdress(indexId);
    const indexName = await walletConnect.walletService.getTokenName(stakedTokenAdress);
    let indexSymbol: string = await walletConnect.walletService.getTokenSymbol(stakedTokenAdress);

    try {
      const tokensAddresses = await walletConnect.walletService.getTokensFromLPToken(
        stakedTokenAdress,
      );
      setLpTokenFirst(tokensAddresses[0]);
      setLpTokenSecond(tokensAddresses[1]);

      const firstSymbol = await walletConnect.walletService.getTokenSymbol(tokensAddresses[0]);
      const secondSymbol = await walletConnect.walletService.getTokenSymbol(tokensAddresses[1]);

      indexSymbol = `${firstSymbol} / ${secondSymbol} LP`;
      setIsLp(true);
    } catch (error) {
      console.error('GET STAKE SYMBOL ERR [useStaking]', { info: error });
    }

    return { indexSymbol: indexSymbol.toUpperCase(), indexName };
  }, [walletConnect.walletService, getStakedTokenAdress, indexId]);

  const getBalanceOfUser = useCallback(async () => {
    const stakedTokenAdress = await getStakedTokenAdress(indexId);
    const userBalance: string = await walletConnect.walletService.getBalanceOf(stakedTokenAdress);

    return userBalance;
  }, [walletConnect.walletService, indexId, getStakedTokenAdress]);

  const getTokenPriceInUsd = useCallback(
    async (indexID: string, isYdr?: boolean, isLp?: boolean) => {
      try {
        if (isYdr) {
          return {
            link: '/ydrtoken',
            priceInUsd: ydrPrice,
          };
        }

        if (isLp) {
          const response = await indexesApi.getLpInfoByAddress(indexID);
          const link = `${SWAP_URLS[currentNetwork as chainsEnum]}${lpTokenFirst}/${lpTokenSecond}`;

          return {
            link,
            priceInUsd: response.data.price,
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
          priceInUsd: '0',
        };
      }
    },
    [currentNetwork, lpTokenFirst, lpTokenSecond, ydrPrice],
  );

  // STAKE TOKENS
  const deposit = useCallback(
    async (amount: string) => {
      const res = await walletConnect.walletService
        .deposit(amount, stakeAddress)
        .on('transactionHash', (hash: string) => {
          txToast(hash);
        });
      if (res.status) {
        setBalance((prev) => new BigNumber(prev).minus(amount).toString());
        setDeposited((prev) => new BigNumber(prev).plus(amount).toString());
        setRewards('0');
        setTotalStaked((prev) => new BigNumber(prev).plus(amount).toString());
      }
    },
    [walletConnect.walletService, setDeposited, setBalance, setTotalStaked, stakeAddress],
  );

  // WITHDRAW
  const withdraw = useCallback(
    async (amount: string) => {
      const res = await walletConnect.walletService
        .withdraw(amount, stakeAddress)
        .on('transactionHash', (hash: string) => {
          txToast(hash);
        });
      if (res.status) {
        setDeposited((prev) => new BigNumber(prev).minus(amount).toString());
        setBalance((prev) => new BigNumber(prev).plus(amount).toString());
        setRewards('0');
        setTotalStaked((prev) => new BigNumber(prev).minus(amount).toString());
      }
    },
    [walletConnect.walletService, setDeposited, setBalance, setTotalStaked, stakeAddress],
  );

  const approve = useCallback(async () => {
    const data = await walletConnect.walletService
      .approve(stakedTokenAdr, stakeAddress)
      .on('transactionHash', (hash: string) => {
        txToast(hash);
      });

    if (data.status) {
      setIsAllowance(true);
    }
  }, [walletConnect.walletService, stakedTokenAdr, stakeAddress]);

  const getAprForStake = useCallback(
    async (stakeAddressId: string, stakingTokenPrice: string) => {
      const rewardTokenPrice = ydrPrice;

      const totalStakedInPool = await walletConnect.walletService.getTotalStaked(stakeAddressId);

      const tokenPerBlock = await walletConnect.walletService.getRewardPerBlock(stakedTokenAdr);

      const totalRewardPricePerYear = new BigNumber(rewardTokenPrice)
        .times(fromWeiToNormal(tokenPerBlock))
        .times(BLOCKS_PER_YEAR[currentNetwork as chainsEnum]);

      const totalStakingTokenInPool = new BigNumber(stakingTokenPrice).times(
        fromWeiToNormal(totalStakedInPool),
      );

      const aprAmount = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100);

      return aprAmount.isNaN() || !aprAmount.isFinite() ? null : aprAmount.toNumber();
    },
    [stakedTokenAdr, walletConnect.walletService, currentNetwork, ydrPrice],
  );

  useEffect(() => {
    // GET STAKE ADDRESS
    walletConnect.walletService.getStakeContractByIndex(indexId).then((stakeAddressId: string) => {
      setStakeAddress(stakeAddressId);

      // INDEX NAME AND SYMBOL
      getStakeSymbolAndName().then((data) => {
        setName(data.indexName);
        setSymbol(data.indexSymbol);
      });

      // USER BALANCE IN THE WALLET
      getBalanceOfUser().then((userBalance) => {
        setBalance(fromWeiToNormal(userBalance));
      });

      // USER STAKED AMOUNT
      walletConnect.walletService
        .getUserStakedAmount(userAddress, stakeAddressId)
        .then((data: any) => {
          setDeposited(fromWeiToNormal(data.amount));
        });

      if (stakedTokenAdr) {
        // TOTAL STAKED AMOUNT
        walletConnect.walletService.getTotalStaked(stakeAddressId).then((data: string) => {
          setTotalStaked(fromWeiToNormal(data));
        });

        // GET APR FOR STAKE
        getAprForStake(stakeAddressId, tokenInfoFromBack.priceInUsd).then((data) => {
          setApr(data);
        });
      }

      // USER REWARDS
      walletConnect.walletService
        .getUserRewards(userAddress, stakeAddressId)
        .then((data: string) => setRewards(fromWeiToNormal(data)));

      // ALLOWANCE
      walletConnect.walletService
        .checkAllowanceById(stakedTokenAdr, configABI.MAIN.ABI, stakeAddressId)
        .then((data: boolean) => {
          setIsAllowance(data);
        });
    });
  }, [
    getStakeSymbolAndName,
    getBalanceOfUser,
    walletConnect.walletService,
    indexId,
    userAddress,
    getStakedTokenAdress,
    getTokenPriceInUsd,
    symbol,
    isTokenLp,
    stakedTokenAdr,
    stakingAddress,
    getAprForStake,
    tokenInfoFromBack.priceInUsd,
  ]);

  useEffect(() => {
    // STAKED TOKEN ADDRESS
    getStakedTokenAdress(indexId).then((data) => {
      setStakedTokenAdr(data);
      if (symbol) {
        getTokenPriceInUsd(data, symbol === 'YDR', isTokenLp).then((tokenInfo) => {
          setTokenInfoFromBack(tokenInfo);
        });
      }
    });
  }, [getStakedTokenAdress, getTokenPriceInUsd, indexId, isTokenLp, symbol]);

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
    apr,
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
