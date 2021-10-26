import BigNumber from 'bignumber.js/bignumber';
import { Observable } from 'rxjs';
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

interface AddEthereumChainParameter {
  chainId: string; // A 0x-prefixed hexadecimal string
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string; // 2-6 characters long
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
  iconUrls?: string[]; // Currently ignored.
}

export type TestNetworkTypes = 'bnb' | 'matic' | 'eth';

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

export default class MetamaskService {
  public wallet;

  public web3Provider;

  // public contract: any;

  public isProduction?: boolean;

  public walletAddress = '';

  public chainChangedObs: any;

  public accountChangedObs: any;

  public disconnectObs: any;

  public usedNetwork: 'mainnet' | 'testnet';

  public usedChain: INetworks;

  constructor() {
    this.wallet = window.ethereum;

    const { IS_PRODUCTION } = config;
    this.web3Provider = new Web3(window.ethereum);
    this.isProduction = IS_PRODUCTION;
    // this.contract = new this.web3Provider.eth.Contract(config.ABI as Array<any>, config.ADDRESS);

    this.usedNetwork = this.isProduction ? 'mainnet' : 'testnet';
    this.usedChain = this.isProduction ? networks : testNetworks;

    this.chainChangedObs = new Observable((subscriber) => {
      this.wallet.on('chainChanged', () => {
        const currentChain = this.wallet.chainId;
        if (!Object.values(this.usedChain).find((chainId) => chainId === currentChain)) {
          subscriber.next(`Please choose one of networks in header select.`);
        } else {
          rootStore.networks.setNetworkId(this.wallet.chainId);
          // TODO: change this on deploy
          if (this.wallet.chainId === this.usedChain.bnb) {
            rootStore.networks.setCurrNetwork('binance-smart-chain');
          } else if (this.wallet.chainId === this.usedChain.matic) {
            rootStore.networks.setCurrNetwork('polygon-pos');
          } else if (this.wallet.chainId === this.usedChain.ethereum) {
            rootStore.networks.setCurrNetwork('ethereum');
          }
          subscriber.next('');
        }
      });
    });

    this.accountChangedObs = new Observable((subscriber) => {
      this.wallet.on('accountsChanged', () => {
        subscriber.next();
      });
    });
    this.disconnectObs = new Observable((subscriber) => {
      this.wallet.on('disconnect', (code: number, reason: string) => {
        subscriber.next(reason);
      });
    });
  }

  isWindowEthEnabled() {
    return !!this.wallet;
  }

  static switchEthereumChain(chainId: string) {
    return window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  }

  static addEthereumChain(param: AddEthereumChainParameter) {
    return window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [param],
    });
  }

  ethRequestAccounts() {
    return this.wallet.request({ method: 'eth_requestAccounts' });
  }

  ethGetCurrentChain() {
    return this.wallet.request({ method: 'eth_chainId' });
  }

  getContractByAddress(address: string, abi: Array<any>) {
    return new this.web3Provider.eth.Contract(abi, address);
  }

  public connect() {
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
  }

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  getBNBBalance() {
    return this.web3Provider.eth.getBalance(this.walletAddress);
  }

  getBalanceOf(address: string) {
    if (address === '0x0000000000000000000000000000000000000000') {
      return this.getBNBBalance();
    }
    return this.getContractByAddress(address, configABI.Token.ABI)
      .methods.balanceOf(this.walletAddress)
      .call();
  }

  async getBalanceByAddress(address: string) {
    return this.getContractByAddress(address, configABI.Token.ABI)
      .methods.balanceOf(this.walletAddress)
      .call();
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

  /*
  static getWrappedNativeAddress = (): string => {
    const wrappedNativeSymbol =
      rootStore.networks.currentNetwork === 'binance-smart-chain' ? 'wbnb' : 'wmatic';
    const wrappedNativeAddress = rootStore.basicTokens.getTokenAddress(wrappedNativeSymbol);
    return wrappedNativeAddress ?? '';
  }; */

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
      console.log(error);
      return false;
    }
  }

  checkAutoXYRebalaceAllowance(address: string) {
    return this.getContractByAddress(address, configABI.MAIN.ABI)
      .methods.isAllowedAutoXYRebalace()
      .call();
  }

  changeAutoXYRebalaceAllowance(address: string, value: boolean) {
    const method = MetamaskService.getMethodInterface(
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
    const method = MetamaskService.getMethodInterface(configABI.MAIN.ABI, 'xyRebalance');
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
    const isNative =
      spenderTokenSymbol.toLowerCase() === 'eth' ||
      spenderTokenSymbol.toLowerCase() === 'bnb' ||
      spenderTokenSymbol.toLowerCase() === 'matic';
    const mintMethod = MetamaskService.getMethodInterface(configABI.MAIN.ABI, 'mint');
    const signature = this.encodeFunctionCall(mintMethod, [
      spenderTokenAddress,
      MetamaskService.calcTransactionAmount(value, decimals),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: indexAddress,
      data: signature,
      value: isNative ? MetamaskService.calcTransactionAmount(value, decimals) : '',
    });
  }

  redeem(value: string, spenderTokenAddress: string, address: string) {
    const redeemMethod = MetamaskService.getMethodInterface(configABI.MAIN.ABI, 'redeem');
    const signature = this.encodeFunctionCall(redeemMethod, [
      MetamaskService.calcTransactionAmount(value, 18),
      spenderTokenAddress,
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: address,
      data: signature,
    });
  }

  async approveById(toContractAddress: string, address: string) {
    try {
      const approveMethod = MetamaskService.getMethodInterface(configABI.MAIN.ABI, 'approve');

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        address,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      ]);

      return this.sendTransaction({
        from: this.walletAddress,
        to: toContractAddress,
        data: approveSignature,
      });
    } catch (error) {
      return error;
    }
  }

  enterIme(
    value: string,
    spenderTokenName: string,
    spenderTokenAddress: string,
    imeAddress: string,
    decimals: number,
  ) {
    const isBnb = spenderTokenName.toLowerCase() === 'bnb';
    const methodName = isBnb ? 'enterImeNative' : 'enterImeToken';
    const enterMethod = MetamaskService.getMethodInterface(configABI.MAIN.ABI, methodName);
    let signature;
    if (!isBnb) {
      signature = this.encodeFunctionCall(enterMethod, [
        spenderTokenAddress,
        MetamaskService.calcTransactionAmount(value, decimals),
      ]);
    } else {
      signature = this.encodeFunctionCall(enterMethod, []);
    }

    return this.sendTransaction({
      from: this.walletAddress,
      to: imeAddress,
      data: signature,
      value: isBnb ? MetamaskService.calcTransactionAmount(value, decimals) : '',
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
          MetamaskService.calcTransactionAmount(value, decimals),
        )
        .call();
    }
    return this.getContractByAddress(indexAddress, configABI.MAIN.ABI)
      .methods.getSellAmountOut(
        currencyAddress,
        MetamaskService.calcTransactionAmount(value, decimals),
      )
      .call();
  }

  // ================== NEW METHODS ====================

  getStakingFactoryContract() {
    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.staking_address ??
        '0x0000000000000000000000000000000000000000',
      configABI.StakingFactory.ABI,
    );
  }

  getStakesCount() {
    return this.getStakingFactoryContract().methods.stakesCount().call();
  }

  getStakeContractByIndex(index: number) {
    return this.getStakingFactoryContract().methods.stakes(index).call();
  }

  getStakedTokenFromStake(stakeAdress: string) {
    return this.getContractByAddress(stakeAdress, configABI.Stake.ABI).methods.stakedToken().call();
  }

  getIndexSymbol(indexAdress: string) {
    return this.getContractByAddress(indexAdress, configABI.Index.ABI).methods.symbol().call();
  }

  getIndexName(indexAdress: string) {
    return this.getContractByAddress(indexAdress, configABI.Index.ABI).methods.name().call();
  }

  getUserBalance(userWalletId: string, indexAddress: string) {
    return this.getContractByAddress(indexAddress, configABI.Index.ABI)
      .methods.balanceOf(userWalletId)
      .call();
  }

  getUserStakedAmount(userWalletId: string, indexId: number) {
    return this.getStakingFactoryContract().methods.getUserBalance(userWalletId, indexId).call();
  }

  getTotalStaked(indexId: number) {
    return this.getStakingFactoryContract().methods.getTotalStaked(indexId).call();
  }

  getUserRewards(userWalletId: string, indexId: number) {
    return this.getStakingFactoryContract().methods.getAvailToClaim(userWalletId, indexId).call();
  }

  // STAKE COINS
  deposit(tokenAddress: string, amount: string) {
    const method = MetamaskService.getMethodInterface(configABI.StakingFactory.ABI, 'deposit');

    const signature = this.encodeFunctionCall(method, [
      tokenAddress,
      MetamaskService.calcTransactionAmount(amount, 18),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.staking_address,
      data: signature,
    });
  }

  // UNSTAKE COINS
  withdraw(tokenAdress: string, amount: string) {
    const method = MetamaskService.getMethodInterface(configABI.StakingFactory.ABI, 'withdraw');

    const signature = this.encodeFunctionCall(method, [
      tokenAdress,
      MetamaskService.calcTransactionAmount(amount, 18),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.staking_address,
      data: signature,
    });
  }

  // CLAIM REWARD FOR STAKE
  claimReward(id: string | number) {
    const method = MetamaskService.getMethodInterface(configABI.StakingFactory.ABI, 'claimReward');

    const signature = this.encodeFunctionCall(method, [id]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.staking_address,
      data: signature,
    });
  }

  // ========== NEW METHODS END =================

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
    const tokenBalance = await this.getBalanceByAddress(address);
    return { address, name: tokenName, symbol: tokenSymbol, balance: tokenBalance };
  }

  async getToken0FromPair(address: string) {
    const contract = this.getContractByAddress(address, configABI.PAIR.ABI);

    const token0 = await contract.methods.token0().call();
    const token1 = await contract.methods.token1().call();
    const det0 = await this.getTokenInfoByAddress(token0);
    const det1 = await this.getTokenInfoByAddress(token1);

    if (det0.name === 'Wrapped BNB') {
      return det1;
    }
    return det0;
  }

  createNewIndex(
    name: string,
    symbol: string,
    imeTimeParameters: string[],
    tokenAddresses: string[],
    tokenWeights: string[],
    initialPrice: string,
  ) {
    const method = MetamaskService.getMethodInterface(configABI.Factory.ABI, 'deployNewAsset');

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
      type: '0x2',
    });
  }
}
