import BigNumber from 'bignumber.js/bignumber';
import WalletConnect from '@walletconnect/web3-provider';
import { Subject } from 'rxjs';
import Web3 from 'web3';

import { rootStore } from '../../store/store';

import configABI from './config_ABI';
import config from '../../config';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface INetworks {
  [key: string]: string;
}

interface INativeCurrency {
  name: string;
  symbol: string; // 2-6 characters long
  decimals: number;
}

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: INativeCurrency;
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

// export type TestNetworkTypes = 'bnb' | 'matic' | 'eth';

export type ContractTypes = 'Router' | 'Factory' | 'Staking' | 'Token';

export const nativeTokens = ['bnb', 'wbnb', 'matic', 'wmatic'];

const networks: INetworks = {
  bnb: '0x38',
  matic: '0x89',
  eth: '0x1',
};
const testNetworks: INetworks = {
  bnb: '0x61',
  matic: '0x13881',
  eth: '0x2a',
};

export enum WALLET_TYPE {
  METAMASK = 'metamask',
  WALLETCONNECT = 'walletconnect',
}

const {
  IS_PRODUCTION,
  NETWORK_BY_CHAIN_ID,
  NETWORK_TOKENS,
  MAX_ATTEMPT_GET_BALANCE,
  MS_RETRY_GET_BALANCE,
} = config;

export default class WalletService {
  public wallet: any;

  public web3Provider: Web3;

  public isProduction?: boolean;

  public walletAddress = '';

  public chainChangedObs: Subject<string>;

  public accountChangedObs: Subject<void>;

  public disconnectObs: Subject<string>;

  public usedNetwork: 'mainnet' | 'testnet';

  public usedChain: INetworks;

  protected walletType: WALLET_TYPE | undefined;

  constructor() {
    this.web3Provider = new Web3();
    this.isProduction = IS_PRODUCTION;
    // this.contract = new this.web3Provider.eth.Contract(config.ABI as Array<any>, config.ADDRESS);

    this.usedNetwork = this.isProduction ? 'mainnet' : 'testnet';
    this.usedChain = this.isProduction ? networks : testNetworks;
    this.chainChangedObs = new Subject();
    /* this.chainChangedObs = new Observable((subscriber) => {
      this.wallet.on('chainChanged', () => {
        const currentChain = this.wallet.chainId;
        if (!Object.values(this.usedChain).find((chainId) => chainId === currentChain)) {
          subscriber.next(`Please choose one of networks in header select.`);
        } else {
          rootStore.networks.setNetworkId(currentChain);
          rootStore.networks.setCurrNetwork(
            (NETWORK_BY_CHAIN_ID[this.usedNetwork] as any)[currentChain],
          );
          subscriber.next('');
        }
      });
    }); */
    this.accountChangedObs = new Subject();
    /* this.accountChangedObs = new Observable((subscriber) => {
       this.wallet.on('accountsChanged', () => {
         subscriber.next();
       });
     }); */
    this.disconnectObs = new Subject();
    /* this.disconnectObs = new Observable((subscriber) => {
      this.wallet.on('disconnect', (code: number, reason: string) => {
        subscriber.next(reason);
      });
    }); */
  }

  protected subscribeOnChanges(): void {
    let isFirstTimeChainChanged = true;
    let isFirstTimeAccountChanged = true;

    this.wallet.on('chainChanged', () => {
      if (this.walletType === WALLET_TYPE.WALLETCONNECT && isFirstTimeChainChanged) {
        isFirstTimeChainChanged = false;
        return;
      }

      const currentChain = this.getChainId();
      if (!Object.values(this.usedChain).find((chainId) => chainId === currentChain)) {
        this.chainChangedObs.next(`Please choose one of networks in header select.`);
      } else {
        rootStore.networks.setNetworkId(currentChain);
        rootStore.networks.setCurrNetwork(
          (NETWORK_BY_CHAIN_ID[this.usedNetwork] as any)[currentChain],
        );
        this.chainChangedObs.next('');
      }
    });

    this.wallet.on('accountsChanged', () => {
      if (this.walletType === WALLET_TYPE.WALLETCONNECT && isFirstTimeAccountChanged) {
        isFirstTimeAccountChanged = false;
        return;
      }

      this.accountChangedObs.next();
    });

    this.wallet.on('disconnect', (errorMessage: any) => {
      this.disconnectObs.next(errorMessage);
    });
  }

  private connectMetamask(): void {
    if (!window.ethereum) {
      throw Error('No Metamask (or other Web3 Provider) installed');
    }

    this.walletType = WALLET_TYPE.METAMASK;
    this.wallet = window.ethereum;
    this.web3Provider.setProvider(this.wallet);
    this.subscribeOnChanges();
  }

  private connectWalletconnect(): void {
    this.walletType = WALLET_TYPE.WALLETCONNECT;
    this.wallet = new WalletConnect({
      infuraId: config.INFURA_KEY,
      rpc: {
        1: `https://mainnet.infura.io/v3/${config.INFURA_KEY}`,
        3: `https://ropsten.infura.io/v3/${config.INFURA_KEY}`,
        56: 'https://bsc-dataseed.binance.org/',
        97: 'https://data-seed-prebsc-2-s1.binance.org:8545/',
      },
    });
    this.web3Provider.setProvider(this.wallet);
    this.subscribeOnChanges();
  }

  async connect(walletType: WALLET_TYPE): Promise<{ address: string; network: string }> {
    if (walletType === WALLET_TYPE.METAMASK) {
      this.connectMetamask();
    } else {
      this.connectWalletconnect();
    }

    if (!this.wallet) {
      throw new Error('wallet is not injected');
    }

    const isChainAcceptable = (currChain: string) => {
      return !!Object.values(this.usedChain).find((chainId) => chainId === currChain);
    };

    [this.walletAddress] = await this.requestAccounts().catch(() => {
      throw new Error('Not authorized');
    });
    let currentChain = this.getChainId();
    if (!currentChain && walletType === WALLET_TYPE.METAMASK) {
      currentChain = await this.requestCurrentChain();
    }

    if (isChainAcceptable(currentChain)) {
      return {
        address: this.walletAddress,
        network: currentChain,
      };
    }
    throw new Error(`Please choose one of networks in header select.`);
  }

  public async disconnect(): Promise<void> {
    if (this.walletType === WALLET_TYPE.WALLETCONNECT) {
      await this.wallet.close();
    }
  }

  isWindowEthEnabled() {
    return !!this.wallet;
  }

  private getChainId(): string {
    if (this.walletType === WALLET_TYPE.METAMASK) {
      return this.wallet.chainId;
    }

    return `0x${this.wallet.chainId.toString(16)}`;
  }

  static switchEthereumChain(chainId: string) {
    return window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  }

  static addEthereumChain(param: AddEthereumChainParameter) {
    const newParam = {
      chainId: param.chainId,
      chainName: param.chainName,
      rpcUrls: param.rpcUrls,
      ...(!!param.blockExplorerUrls && { blockExplorerUrls: param.blockExplorerUrls }),
      ...(!!param.iconUrls && { iconUrls: param.iconUrls }),
      nativeCurrency: {
        name: param.nativeCurrency.name,
        decimals: param.nativeCurrency.decimals,
        symbol: param.nativeCurrency.symbol,
      },
    } as AddEthereumChainParameter;
    return window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [newParam],
    });
  }

  private async requestAccounts(): Promise<string[]> {
    if (this.walletType === WALLET_TYPE.METAMASK) {
      return this.wallet.request({ method: 'eth_requestAccounts' });
    }

    return this.wallet.enable();
  }

  async requestCurrentChain(): Promise<string> {
    if (this.walletType === WALLET_TYPE.METAMASK) {
      return this.wallet.request({ method: 'eth_chainId' });
    }

    return `0x${this.wallet.chainId.toString(16)}`;
  }

  getContractByAddress(address: string, abi: Array<any>) {
    return new this.web3Provider.eth.Contract(abi, address);
  }

  /* public connect() {
    const currentChain = this.wallet.chainId;

    return new Promise((resolve, reject) => {
      if (!this.wallet) {
        reject(new Error('metamask wallet is not injected'));
      }
      const isChainAcceptable = (currChain: string) => {
        return !!Object.values(this.usedChain).find((chainId) => chainId === currChain);
      };
      if (!currentChain || currentChain === null) {
        this.wallet
          .request({ method: 'eth_chainId' })
          .then((resChain: any) => {
            if (isChainAcceptable(resChain)) {
              this.ethRequestAccounts()
                .then((account: any) => {
                  [this.walletAddress] = account;
                  resolve({
                    address: account[0],
                    network: resChain,
                  });
                })
                .catch(() => reject(new Error('Not authorized')));
            } else {
              reject(new Error(`Please choose one of networks in header select.`));
            }
          })
          .catch(() => reject(new Error('Not authorized')));
      } else if (isChainAcceptable(currentChain)) {
        this.ethRequestAccounts()
          .then((account: any) => {
            [this.walletAddress] = account;
            resolve({
              address: account[0],
              network: currentChain,
            });
          })
          .catch(() => reject(new Error('Not authorized')));
      } else {
        reject(new Error(`Please choose one of networks in header select.`));
      }
    });
  } */

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  static delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async getBNBBalance() {
    for (let i = 0; i < MAX_ATTEMPT_GET_BALANCE; i += 1) {
      try {
        if (this.walletAddress) {
          /* eslint-disable no-await-in-loop */
          const balance = await this.web3Provider.eth.getBalance(this.walletAddress);
          return Number(balance);
        }

        return 0;
      } catch (err: any) {
        if (i < MAX_ATTEMPT_GET_BALANCE - 1) {
          if (err.message === 'Network Error') {
            await WalletService.delay(MS_RETRY_GET_BALANCE);
          } else {
            throw new Error('Get Balance failed');
          }
        }
      }
    }

    throw new Error('Get Balance failed');
    // return this.web3Provider.eth.getBalance(this.walletAddress);
  }

  async getBalanceOf(address: string) {
    if (address === '0x0000000000000000000000000000000000000000') {
      return this.getBNBBalance();
    }
    for (let i = 0; i < MAX_ATTEMPT_GET_BALANCE; i += 1) {
      try {
        if (this.walletAddress) {
          /* eslint-disable no-await-in-loop */
          const balance = await this.getContractByAddress(address, configABI.Token.ABI)
            .methods.balanceOf(this.walletAddress)
            .call();
          return balance;
        }

        return 0;
      } catch (err: any) {
        if (i < MAX_ATTEMPT_GET_BALANCE - 1) {
          if (err.message === 'Network Error') {
            await WalletService.delay(MS_RETRY_GET_BALANCE);
          } else {
            throw new Error('Get Balance failed');
          }
        }
      }
    }

    throw new Error('Get Balance failed');
    // return this.getContractByAddress(address, configABI.Token.ABI)
    //   .methods.balanceOf(this.walletAddress)
    //   .call();
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(contractAddress: string, tokenDecimals: number) {
    const totalSupply = await this.getContractByAddress(contractAddress, configABI.Token.ABI)
      .methods.totalSupply()
      .call();
    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  async getDecimals(address: string, abi: any[]) {
    const decimals = await this.getContractByAddress(address, abi).methods.decimals().call();
    return +decimals;
  }

  static calcTransactionAmount(amount: number | string, tokenDecimal: number) {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  signMsg(msg: string) {
    return this.web3Provider.eth.personal.sign(msg, this.walletAddress, '');
  }

  getStartDate(address: string) {
    return this.getContractByAddress(address, configABI.MAIN.ABI)
      .methods.imeStartTimestamp()
      .call();
  }

  getEndDate(address: string) {
    // TODO: change this to normal contract later
    return this.getContractByAddress(address, configABI.MAIN.ABI).methods.imeEndTimestamp().call();
  }

  async checkAllowanceById(toContractAddress: string, abi: Array<any>, spenderAddress: string) {
    try {
      const result = await this.getContractByAddress(toContractAddress, abi)
        .methods.allowance(this.walletAddress, spenderAddress)
        .call();

      if (result === '0') return false;
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  checkAutoXYRebalaceAllowance(address: string) {
    return this.getContractByAddress(address, configABI.MAIN.ABI)
      .methods.isAllowedAutoXYRebalace()
      .call();
  }

  changeAutoXYRebalaceAllowance(address: string, value: boolean) {
    const method = WalletService.getMethodInterface(
      configABI.MAIN.ABI,
      'setIsAllowedAutoXYRebalace',
    );
    const signature = this.encodeFunctionCall(method, [value]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: address,
      data: signature,
    });
  }

  startXyRebalance(address: string, value: number) {
    const method = WalletService.getMethodInterface(configABI.MAIN.ABI, 'xyRebalance');
    const signature = this.encodeFunctionCall(method, [value]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: address,
      data: signature,
    });
  }

  mint(
    value: string,
    spenderTokenSymbol: string,
    spenderTokenAddress: string,
    indexAddress: string,
    decimals: number,
  ) {
    /* const isNative =
      spenderTokenSymbol.toLowerCase() === 'eth' ||
      spenderTokenSymbol.toLowerCase() === 'bnb' ||
      spenderTokenSymbol.toLowerCase() === 'matic'; */
    // TODO: change network tokens
    const isNative = Object.keys(NETWORK_TOKENS).includes(spenderTokenSymbol.toLowerCase());
    const mintMethod = WalletService.getMethodInterface(configABI.MAIN.ABI, 'mint');
    const signature = this.encodeFunctionCall(mintMethod, [
      spenderTokenAddress,
      WalletService.calcTransactionAmount(value, decimals),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: indexAddress,
      data: signature,
      value: isNative ? WalletService.calcTransactionAmount(value, decimals) : '',
    });
  }

  redeem(value: string, spenderTokenAddress: string, address: string) {
    const redeemMethod = WalletService.getMethodInterface(configABI.MAIN.ABI, 'redeem');
    const signature = this.encodeFunctionCall(redeemMethod, [
      WalletService.calcTransactionAmount(value, 18),
      spenderTokenAddress,
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: address,
      data: signature,
    });
  }

  approve(toContractAddress: string, address: string) {
    const approveMethod = WalletService.getMethodInterface(configABI.MAIN.ABI, 'approve');

    const approveSignature = this.encodeFunctionCall(approveMethod, [
      address,
      '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: toContractAddress,
      data: approveSignature,
    });
  }

  enterIme(
    value: string,
    spenderTokenName: string,
    spenderTokenAddress: string,
    imeAddress: string,
    decimals: number,
  ) {
    const isNative = Object.keys(NETWORK_TOKENS).includes(spenderTokenName.toLowerCase());
    const methodName = isNative ? 'enterImeNative' : 'enterImeToken';
    const enterMethod = WalletService.getMethodInterface(configABI.MAIN.ABI, methodName);
    let signature;
    if (!isNative) {
      signature = this.encodeFunctionCall(enterMethod, [
        spenderTokenAddress,
        WalletService.calcTransactionAmount(value, decimals),
      ]);
    } else {
      signature = this.encodeFunctionCall(enterMethod, []);
    }

    return this.sendTransaction({
      from: this.walletAddress,
      to: imeAddress,
      data: signature,
      value: isNative ? WalletService.calcTransactionAmount(value, decimals) : '',
    });
  }

  getIndexCourse(
    currencyAddress: string,
    value: string,
    buy: boolean,
    indexAddress: string,
    decimals: number,
  ) {
    if (buy) {
      return this.getContractByAddress(indexAddress, configABI.MAIN.ABI)
        .methods.getBuyAmountOut(
          currencyAddress,
          WalletService.calcTransactionAmount(value, decimals),
        )
        .call();
    }
    return this.getContractByAddress(indexAddress, configABI.MAIN.ABI)
      .methods.getSellAmountOut(
        currencyAddress,
        WalletService.calcTransactionAmount(value, decimals),
      )
      .call();
  }

  getStakingFactoryContract() {
    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.staking_address ??
        '0x0000000000000000000000000000000000000000',
      configABI.StakingFactory.ABI,
    );
  }

  getStakesCount() {
    return this.getStakingFactoryContract().methods.getStakedCount().call();
  }

  getRewardPerBlock(stakedTokenAddress: string) {
    return this.getStakingFactoryContract().methods.rewardPerBlock(stakedTokenAddress).call();
  }

  getStakeContractByIndex(index: number) {
    return this.getStakingFactoryContract().methods.stakes(index).call();
  }

  getStakedTokenFromStake(stakeAdress: string) {
    return this.getContractByAddress(stakeAdress, configABI.Stake.ABI).methods.stakedToken().call();
  }

  getUserStakedAmount(userWalletId: string, stakeAddress: string) {
    return this.getContractByAddress(stakeAddress, configABI.Stake.ABI)
      .methods.userInfo(userWalletId)
      .call();
  }

  getTotalStaked(stakeAddress: string) {
    return this.getContractByAddress(stakeAddress, configABI.Stake.ABI)
      .methods.stakedTokenSupply()
      .call();
  }

  getUserRewards(userWalletId: string, stakeId: string) {
    return this.getContractByAddress(stakeId, configABI.Stake.ABI)
      .methods.pendingReward(userWalletId)
      .call();
  }

  // STAKE COINS
  deposit(amount: string, stakedAddress: string) {
    const method = WalletService.getMethodInterface(configABI.Stake.ABI, 'deposit');

    const signature = this.encodeFunctionCall(method, [
      WalletService.calcTransactionAmount(amount, 18),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: stakedAddress,
      data: signature,
    });
  }

  /**
   *A function for withdrawing a number of tokens from yVault to your address.
   *tokenAmounts corresponds to the tokensInAsset array. The function can be called by the administrator only.
   * @param tokenAmounts - in WEI
   * @param indexAddress - address from withdraw
   */
  withdrawTokensForStaking(tokenAmounts: string[], indexAddress: string) {
    const method = WalletService.getMethodInterface(
      configABI.Index.ABI,
      'withdrawTokensForStaking',
    );

    const signature = this.encodeFunctionCall(method, [tokenAmounts]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: indexAddress,
      data: signature,
    });
  }

  /**
   * A function for sending tokens back to the index and for sending dividends to a staking contract.
   * @param tokenAmounts - all token amounts in WEI, except NativeCurrency(eth,bnb)
   * @param indexAddress - address to deposit
   * @param value - NativeCurrency(eth,bnb) amount in WEI
   */
  depositToIndex(tokenAmounts: string[], indexAddress: string, value?: string) {
    const method = WalletService.getMethodInterface(configABI.Index.ABI, 'depositToIndex');

    const signature = this.encodeFunctionCall(method, [tokenAmounts]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: indexAddress,
      data: signature,
      value: value || 0,
    });
  }

  // UNSTAKE COINS
  withdraw(amount: string, stakeAddres: string) {
    const method = WalletService.getMethodInterface(configABI.Stake.ABI, 'withdraw');

    const signature = this.encodeFunctionCall(method, [
      WalletService.calcTransactionAmount(amount, 18),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: stakeAddres,
      data: signature,
    });
  }

  async getTokensFromLPToken(tokenAddress: string) {
    const LPContract = this.getContractByAddress(tokenAddress, configABI.LPToken.ABI);

    const token0 = await LPContract.methods.token0().call();
    const token1 = await LPContract.methods.token1().call();

    return [token0, token1];
  }

  getStakingFactoryTokenToEnter(index: number) {
    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.staking_address ?? '',
      configABI.StakingFactory.ABI,
    )
      .methods.tokensToEnter(index)
      .call();
  }

  getTokenName(address: string) {
    return this.getContractByAddress(address, configABI.Token.ABI).methods.name().call();
  }

  getTokenSymbol(address: string) {
    return this.getContractByAddress(address, configABI.Token.ABI).methods.symbol().call();
  }

  async getTokenInfoByAddress(address: string) {
    const tokenName = await this.getTokenName(address);
    const tokenSymbol = await this.getTokenSymbol(address);
    const tokenBalance = await this.getBalanceOf(address);
    return { address, name: tokenName, symbol: tokenSymbol, balance: tokenBalance };
  }

  createNewIndex(
    name: string,
    symbol: string,
    imeTimeParameters: string[],
    tokenAddresses: string[],
    tokenWeights: string[],
    initialPrice: string,
  ) {
    const method = WalletService.getMethodInterface(configABI.Factory.ABI, 'deployNewAsset');

    const signature = this.encodeFunctionCall(method, [
      name,
      symbol,
      imeTimeParameters,
      tokenAddresses,
      tokenWeights,
      initialPrice,
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.fabric_address,
      data: signature,
    });
  }

  sendTransaction(transactionConfig: any) {
    return this.web3Provider.eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
      ...(rootStore.networks.currentNetwork === 'eth' && { type: '0x2' }),
    });
  }
}
