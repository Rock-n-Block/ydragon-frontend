import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';
import { Observable } from 'rxjs';
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

export default class MetamaskService {
  public wallet;

  public web3Provider;

  // public contract: any;

  public isProduction?: boolean;

  public walletAddress = '';

  public chainChangedObs: any;

  public accountChangedObs: any;

  public disconnectObs: any;

  public usedNetwork: string;

  public usedChain: INetworks;

  constructor() {
    this.wallet = window.ethereum;

    this.web3Provider = new Web3(window.ethereum);
    this.isProduction = process.env.REACT_APP_IS_PROD === 'production';
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

  signMsg(msg: string) {
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
    const method = MetamaskService.getMethodInterface(
      config.MAIN.ABI,
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
    const method = MetamaskService.getMethodInterface(config.MAIN.ABI, 'xyRebalance');
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
    const mintMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'mint');
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
    const redeemMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'redeem');
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
      const approveMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'approve');

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
    const enterMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, methodName);
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
        ? [MetamaskService.getWrappedNativeAddress(), rootStore.basicTokens.getTokenAddress('ydr')]
        : [
            otherTokenAddress,
            MetamaskService.getWrappedNativeAddress(),
            rootStore.basicTokens.getTokenAddress('ydr'),
          ];
    } else {
      path = isNative
        ? [rootStore.basicTokens.getTokenAddress('ydr'), MetamaskService.getWrappedNativeAddress()]
        : [
            rootStore.basicTokens.getTokenAddress('ydr'),
            MetamaskService.getWrappedNativeAddress(),
            otherTokenAddress,
          ];
    }

    return this.getContractByAddress(
      rootStore.networks.getCurrNetwork()?.router_address || '',
      config.Router.ABI,
    )
      .methods.getAmountsOut(MetamaskService.calcTransactionAmount(value, decimals), path)
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
          MetamaskService.calcTransactionAmount(value, decimals),
        )
        .call();
    }
    return this.getContractByAddress(indexAddress, config.MAIN.ABI)
      .methods.getSellAmountOut(
        currencyAddress,
        MetamaskService.calcTransactionAmount(value, decimals),
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

    const buyMethod = MetamaskService.getMethodInterface(config.Router.ABI, methodName);

    let signature;
    if (!isNative) {
      signature = this.encodeFunctionCall(buyMethod, [
        MetamaskService.calcTransactionAmount(value, decimals),
        0,
        otherTokenAddress
          ? [
              otherTokenAddress,
              MetamaskService.getWrappedNativeAddress(),
              rootStore.basicTokens.getTokenAddress('ydr'),
            ]
          : [
              MetamaskService.getWrappedNativeAddress(),
              rootStore.basicTokens.getTokenAddress('ydr'),
            ],
        this.walletAddress,
        moment().add(30, 'minutes').format('X'),
      ]);
    } else {
      signature = this.encodeFunctionCall(buyMethod, [
        0,
        [MetamaskService.getWrappedNativeAddress(), rootStore.basicTokens.getTokenAddress('ydr')],
        this.walletAddress,
        moment().add(30, 'minutes').format('X'),
      ]);
    }

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.router_address,
      data: signature,
      value: isNative ? MetamaskService.calcTransactionAmount(value, decimals) : '',
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

    const sellMethod = MetamaskService.getMethodInterface(config.Router.ABI, methodName);

    const signature = this.encodeFunctionCall(sellMethod, [
      MetamaskService.calcTransactionAmount(value, decimals),
      '0x0000000000000000000000000000000000000000',
      otherTokenAddress
        ? [
            rootStore.basicTokens.getTokenAddress('ydr'),
            MetamaskService.getWrappedNativeAddress(),
            otherTokenAddress,
          ]
        : [rootStore.basicTokens.getTokenAddress('ydr'), MetamaskService.getWrappedNativeAddress()],
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
    const method = MetamaskService.getMethodInterface(config.Staking.ABI, 'claimDividends');

    const signature = this.encodeFunctionCall(method, [id, '0']);

    return this.sendTransaction({
      from: this.walletAddress,
      to: rootStore.networks.getCurrNetwork()?.staking_address,
      data: signature,
    });
  }

  endStake(id: string | number) {
    const method = MetamaskService.getMethodInterface(config.Staking.ABI, 'stakeEnd');

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
      .methods.getPair(address, MetamaskService.getWrappedNativeAddress())
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
    const method = MetamaskService.getMethodInterface(config.Staking.ABI, 'stakeStart');

    const signature = this.encodeFunctionCall(method, [
      tokenAddress,
      MetamaskService.calcTransactionAmount(amount, 18),
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
    const method = MetamaskService.getMethodInterface(config.Factory.ABI, 'deployNewAsset');

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
