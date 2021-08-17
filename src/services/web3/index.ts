import WalletConnectProvider from '@walletconnect/web3-provider';
import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';
import { Subject } from 'rxjs';
import Web3 from 'web3';

import { rootStore } from '../../store/store';

import config from './config';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface INetworks {
  [key: string]: string;
}

export type TestNetworkTypes = 'bnb' | 'matic' | 'eth';

export type ContractTypes = 'Router' | 'Factory' | 'Staking' | 'DexFactory' | 'Token';

export const nativeTokens = ['bnb', 'wbnb', 'matic', 'wmatic'];

const networks: INetworks = {
  bnb: '0x38',
  matic: '0x89',
  eth: '0x1',
};

const testNetworks: INetworks = {
  bnb: '0x61',
  matic: '0x13881',
  eth: '0x3',
};

export enum WALLET_TYPE {
  METAMASK = 'metamask',
  WALLETCONNECT = 'walletconnect',
}

export default class WalletService {
  public wallet: any;

  public web3Provider: Web3;

  // public contract: any;

  public isProduction?: boolean;

  public walletAddress = '';

  public chainChangedObs: Subject<string>;

  public accountChangedObs: Subject<void>;

  public disconnectObs: Subject<string>;

  public usedNetwork: string;

  public usedChain: INetworks;

  protected walletType: WALLET_TYPE | undefined;

  constructor() {
    this.web3Provider = new Web3();

    this.isProduction = process.env.REACT_APP_IS_PROD === 'production';
    // this.contract = new this.web3Provider.eth.Contract(config.ABI as Array<any>, config.ADDRESS);

    this.usedNetwork = this.isProduction ? 'mainnet' : 'testnet';
    this.usedChain = this.isProduction ? networks : testNetworks;

    this.chainChangedObs = new Subject();
    this.accountChangedObs = new Subject();
    this.disconnectObs = new Subject();
  }

  protected subscribeOnChanges(): void {
    let isFirstTime = true;

    this.wallet.on('chainChanged', () => {
      if (this.walletType === WALLET_TYPE.WALLETCONNECT && isFirstTime) {
        isFirstTime = false;
        return;
      }

      const currentChain = this.getChainId();
      if (!Object.values(this.usedChain).find((chainId) => chainId === currentChain)) {
        this.chainChangedObs.next(`Please choose one of networks in header select.`);
      } else {
        rootStore.networks.setNetworkId(currentChain);
        // TODO: change this on deploy
        if (currentChain === this.usedChain.bnb) {
          rootStore.networks.setCurrNetwork('binance-smart-chain');
        } else if (currentChain === this.usedChain.matic) {
          rootStore.networks.setCurrNetwork('polygon-pos');
        }
        this.chainChangedObs.next('');
      }
    });

    this.wallet.on('accountsChanged', () => {
      this.accountChangedObs.next();
    });

    this.wallet.on('disconnect', (code: number, reason: string) => {
      this.disconnectObs.next(reason);
    });
  }

  private connectMetamask(): void {
    if (!window.ethereum) {
      throw Error('No Metamask (or other Web3 Provider) installed');
    }

    this.walletType = WALLET_TYPE.METAMASK;
    this.wallet = window.ethereum;
    this.web3Provider = new Web3(this.wallet);
    this.subscribeOnChanges();
  }

  private connectWalletconnect(): void {
    this.walletType = WALLET_TYPE.WALLETCONNECT;
    this.wallet = new WalletConnectProvider({
      infuraId: '886cb294bf2a440e9f78a654a6941ff3',
      rpc: {
        1: 'https://mainnet.infura.io/v3/886cb294bf2a440e9f78a654a6941ff3',
        3: 'https://ropsten.infura.io/v3/886cb294bf2a440e9f78a654a6941ff3',
        56: 'https://bsc-dataseed.binance.org/',
        97: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
      },
      bridge: 'https://bridge.walletconnect.org',
    });
    this.web3Provider = new Web3(this.wallet);
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

  private async requestAccounts(): Promise<string[]> {
    if (this.walletType === WALLET_TYPE.METAMASK) {
      return this.wallet.request({ method: 'eth_requestAccounts' });
    }

    return this.wallet.enable();
  }

  private getChainId(): string {
    if (this.walletType === WALLET_TYPE.METAMASK) {
      return this.wallet.chainId;
    }

    return `0x${this.wallet.chainId.toString(16)}`;
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
    return this.getContractByAddress(address, config.Token.ABI)
      .methods.balanceOf(this.walletAddress)
      .call();
  }

  async getBalanceByAddress(address: string) {
    return this.getContractByAddress(address, config.Token.ABI)
      .methods.balanceOf(this.walletAddress)
      .call();
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(contractAddress: string, tokenDecimals: number) {
    const totalSupply = await this.getContractByAddress(contractAddress, config.Token.ABI)
      .methods.totalSupply()
      .call();
    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  async getDecimals(address: string, abi: any[]) {
    const decimals = await this.getContractByAddress(address, abi).methods.decimals().call();
    return +decimals;
  }

  static getWrappedNativeAddress = (): string => {
    const wrappedNativeSymbol =
      rootStore.networks.currentNetwork === 'binance-smart-chain' ? 'wbnb' : 'wmatic';
    const wrappedNativeAddress = rootStore.basicTokens.getTokenAddress(wrappedNativeSymbol);
    return wrappedNativeAddress ?? '';
  };

  static calcTransactionAmount(amount: number | string, tokenDecimal: number) {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  signMsg(msg: string): Promise<string> {
    return this.web3Provider.eth.personal.sign(msg, this.walletAddress, '');
  }

  getStartDate(address: string) {
    return this.getContractByAddress(address, config.MAIN.ABI).methods.imeStartTimestamp().call();
  }

  getEndDate(address: string) {
    // TODO: change this to normal contract later
    return this.getContractByAddress(address, config.MAIN.ABI).methods.imeEndTimestamp().call();
  }

  async checkAllowanceById(toContractAddress: string, abi: Array<any>, spenderAddress: string) {
    try {
      const result = await this.getContractByAddress(toContractAddress, abi)
        .methods.allowance(this.walletAddress, spenderAddress)
        .call();

      if (result === '0') return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  checkAutoXYRebalaceAllowance(address: string) {
    return this.getContractByAddress(address, config.MAIN.ABI)
      .methods.isAllowedAutoXYRebalace()
      .call();
  }

  changeAutoXYRebalaceAllowance(address: string, value: boolean) {
    const method = WalletService.getMethodInterface(config.MAIN.ABI, 'setIsAllowedAutoXYRebalace');
    const signature = this.encodeFunctionCall(method, [value]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: address,
      data: signature,
    });
  }

  startXyRebalance(address: string, value: number) {
    const method = WalletService.getMethodInterface(config.MAIN.ABI, 'xyRebalance');
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
      spenderTokenSymbol.toLowerCase() === 'bnb' || spenderTokenSymbol.toLowerCase() === 'matic';
    const mintMethod = WalletService.getMethodInterface(config.MAIN.ABI, 'mint');
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
    const redeemMethod = WalletService.getMethodInterface(config.MAIN.ABI, 'redeem');
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

  async approveById(toContractAddress: string, address: string) {
    try {
      const approveMethod = WalletService.getMethodInterface(config.MAIN.ABI, 'approve');

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
    const enterMethod = WalletService.getMethodInterface(config.MAIN.ABI, methodName);
    let signature;
    if (!isBnb) {
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
      value: isBnb ? WalletService.calcTransactionAmount(value, decimals) : '',
    });
  }

  getYDRCourse(
    spenderTokenSymbol: string,
    spenderTokenAddress: string,
    value: string,
    buy: boolean,
    decimals: number,
  ) {
    const isNative = nativeTokens.includes(spenderTokenSymbol.toLowerCase());
    let otherTokenAddress /* = address */;
    let path;
    if (!isNative) {
      otherTokenAddress = spenderTokenAddress;
    }
    if (buy) {
      path = isNative
        ? [WalletService.getWrappedNativeAddress(), rootStore.basicTokens.getTokenAddress('ydr')]
        : [
            otherTokenAddress,
            WalletService.getWrappedNativeAddress(),
            rootStore.basicTokens.getTokenAddress('ydr'),
          ];
    } else {
      path = isNative
        ? [rootStore.basicTokens.getTokenAddress('ydr'), WalletService.getWrappedNativeAddress()]
        : [
            rootStore.basicTokens.getTokenAddress('ydr'),
            WalletService.getWrappedNativeAddress(),
            otherTokenAddress,
          ];
    }

    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.router_address || '',
      config.Router.ABI,
    )
      .methods.getAmountsOut(WalletService.calcTransactionAmount(value, decimals), path)
      .call();
  }

  getIndexCourse(
    currencyAddress: string,
    value: string,
    buy: boolean,
    indexAddress: string,
    decimals: number,
  ) {
    if (buy) {
      return this.getContractByAddress(indexAddress, config.MAIN.ABI)
        .methods.getBuyAmountOut(
          currencyAddress,
          WalletService.calcTransactionAmount(value, decimals),
        )
        .call();
    }
    return this.getContractByAddress(indexAddress, config.MAIN.ABI)
      .methods.getSellAmountOut(
        currencyAddress,
        WalletService.calcTransactionAmount(value, decimals),
      )
      .call();
  }

  async buyYDRToken(
    value: string,
    spenderTokenSymbol: string,
    spenderTokenAddress: string,
    decimals: number,
  ) {
    let methodName: 'swapExactETHForTokens' | 'swapExactTokensForTokens';
    const isNative =
      spenderTokenSymbol.toLowerCase() === 'bnb' || spenderTokenSymbol.toLowerCase() === 'matic';
    let otherTokenAddress /* = address */;

    if (isNative) {
      methodName = 'swapExactETHForTokens';
    } else {
      otherTokenAddress =
        spenderTokenSymbol.toLowerCase() === 'wbnb' || spenderTokenSymbol.toLowerCase() === 'wmatic'
          ? undefined
          : spenderTokenAddress;
      methodName = 'swapExactTokensForTokens';
    }

    const buyMethod = WalletService.getMethodInterface(config.Router.ABI, methodName);

    let signature;
    if (!isNative) {
      signature = this.encodeFunctionCall(buyMethod, [
        WalletService.calcTransactionAmount(value, decimals),
        0,
        otherTokenAddress
          ? [
              otherTokenAddress,
              WalletService.getWrappedNativeAddress(),
              rootStore.basicTokens.getTokenAddress('ydr'),
            ]
          : [WalletService.getWrappedNativeAddress(), rootStore.basicTokens.getTokenAddress('ydr')],
        this.walletAddress,
        moment().add(30, 'minutes').format('X'),
      ]);
    } else {
      signature = this.encodeFunctionCall(buyMethod, [
        0,
        [WalletService.getWrappedNativeAddress(), rootStore.basicTokens.getTokenAddress('ydr')],
        this.walletAddress,
        moment().add(30, 'minutes').format('X'),
      ]);
    }

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.router_address,
      data: signature,
      value: isNative ? WalletService.calcTransactionAmount(value, decimals) : '',
    });
  }

  sellYDRToken(
    value: string,
    spenderTokenSymbol: string,
    spenderTokenAddress: string,
    decimals: number,
  ) {
    let methodName: 'swapExactTokensForETH' | 'swapExactTokensForTokens';

    const isNative =
      spenderTokenSymbol.toLowerCase() === 'bnb' || spenderTokenSymbol.toLowerCase() === 'matic';
    let otherTokenAddress /* = address */;

    if (isNative) {
      methodName = 'swapExactTokensForETH';
    } else {
      otherTokenAddress =
        spenderTokenSymbol.toLowerCase() === 'wbnb' || spenderTokenSymbol.toLowerCase() === 'wmatic'
          ? undefined
          : spenderTokenAddress;
      methodName = 'swapExactTokensForTokens';
    }

    const sellMethod = WalletService.getMethodInterface(config.Router.ABI, methodName);

    const signature = this.encodeFunctionCall(sellMethod, [
      WalletService.calcTransactionAmount(value, decimals),
      '0x0000000000000000000000000000000000000000',
      otherTokenAddress
        ? [
            rootStore.basicTokens.getTokenAddress('ydr'),
            WalletService.getWrappedNativeAddress(),
            otherTokenAddress,
          ]
        : [rootStore.basicTokens.getTokenAddress('ydr'), WalletService.getWrappedNativeAddress()],
      this.walletAddress,
      moment().add(30, 'minutes').format('X'),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.router_address,
      data: signature,
    });
  }

  harvestStakeItem(id: string | number) {
    const method = WalletService.getMethodInterface(config.Staking.ABI, 'claimDividends');

    const signature = this.encodeFunctionCall(method, [id, '0']);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.staking_address,
      data: signature,
    });
  }

  endStake(id: string | number) {
    const method = WalletService.getMethodInterface(config.Staking.ABI, 'stakeEnd');

    const signature = this.encodeFunctionCall(method, [id]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.staking_address,
      data: signature,
    });
  }

  getStakingTokensLen() {
    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.staking_address ??
        '0x0000000000000000000000000000000000000000',
      config.Staking.ABI,
    )
      .methods.tokensToEnterLen()
      .call();
  }

  getStakingTokenToEnter(index: number) {
    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.staking_address ?? '',
      config.Staking.ABI,
    )
      .methods.tokensToEnter(index)
      .call();
  }

  getStakingPair(address: string) {
    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.dex_factory_address ?? '',
      config.DexFactory.ABI,
    )
      .methods.getPair(address, WalletService.getWrappedNativeAddress())
      .call();
  }

  getTokenName(address: string) {
    return this.getContractByAddress(address, config.Token.ABI).methods.name().call();
  }

  getTokenSymbol(address: string) {
    return this.getContractByAddress(address, config.Token.ABI).methods.symbol().call();
  }

  async getTokenInfoByAddress(address: string) {
    const tokenName = await this.getTokenName(address);
    const tokenSymbol = await this.getTokenSymbol(address);
    const tokenBalance = await this.getBalanceByAddress(address);
    return { address, name: tokenName, symbol: tokenSymbol, balance: tokenBalance };
  }

  startStake(tokenAddress: string, amount: string, timeIntervalIndex: number) {
    const method = WalletService.getMethodInterface(config.Staking.ABI, 'stakeStart');

    const signature = this.encodeFunctionCall(method, [
      tokenAddress,
      WalletService.calcTransactionAmount(amount, 18),
      timeIntervalIndex,
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.staking_address,
      data: signature,
    });
  }

  createNewIndex(
    name: string,
    symbol: string,
    imeTimeParameters: string[],
    tokenAddresses: string[],
    tokenWeights: string[],
    initialPrice: string,
  ) {
    const method = WalletService.getMethodInterface(config.Factory.ABI, 'deployNewAsset');

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

  getGasPrice(): Promise<string> {
    return this.web3Provider.eth.getGasPrice();
  }

  checkBridgeAllowance(contractAddress: string, tokenAddress: string): Promise<boolean> {
    return this.checkAllowanceById(tokenAddress, config.Token.ABI, contractAddress);
  }

  getBridgeFee(contractAddress: string, toBlockchain: number): Promise<string> {
    const contract = this.getContractByAddress(contractAddress, config.Bridge.ABI);
    return contract.methods.feeAmountOfBlockchain(toBlockchain).call();
  }

  getBridgeMinAmount(contractAddress: string): Promise<string> {
    const contract = this.getContractByAddress(contractAddress, config.Bridge.ABI);
    return contract.methods.minTokenAmount().call();
  }

  swapTokensToOtherBlockchain(
    contractAddress: string,
    toBlockchain: number,
    amountAbsolute: string,
    toAddress: string,
  ): Promise<void> {
    const contract = this.getContractByAddress(contractAddress, config.Bridge.ABI);
    return contract.methods
      .transferToOtherBlockchain(toBlockchain, amountAbsolute, toAddress)
      .send({
        from: this.walletAddress,
      });
  }
}
