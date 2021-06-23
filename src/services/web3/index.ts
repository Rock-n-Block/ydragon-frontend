import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';
import { Observable } from 'rxjs';
import Web3 from 'web3';

import config from './config';

declare global {
  interface Window {
    ethereum: any;
  }
}

interface INetworks {
  [key: string]: string;
}

interface IMetamaskService {
  testnet: 'ropsten' | 'kovan' | 'rinkeby' | 'bnbt';
  isProduction?: boolean;
}

export type ContractTypes = 'BNB' | 'WBNB' | 'MAIN' | 'USDT' | 'YDR' | 'Router' | 'Factory';

const networks: INetworks = {
  mainnet: '0x1',
  ropsten: '0x3',
  kovan: '0x2a',
  rinkeby: '0x4',
  bnbt: '0x61',
};

export default class MetamaskService {
  public wallet;

  public web3Provider;

  // public contract: any;

  private testnet: string;

  private isProduction: boolean;

  public walletAddress = '';

  public chainChangedObs: any;

  public accountChangedObs: any;

  public disconnectObs: any;

  public usedNetwork: string;

  public usedChain: string;

  constructor({ testnet, isProduction = false }: IMetamaskService) {
    this.wallet = window.ethereum;

    this.web3Provider = new Web3(window.ethereum);
    this.testnet = testnet;
    this.isProduction = isProduction;
    // this.contract = new this.web3Provider.eth.Contract(config.ABI as Array<any>, config.ADDRESS);

    this.usedNetwork = this.isProduction ? 'mainnet' : this.testnet;
    this.usedChain = this.isProduction ? networks.mainnet : networks[this.testnet];

    this.chainChangedObs = new Observable((subscriber) => {
      this.wallet.on('chainChanged', () => {
        const currentChain = this.wallet.chainId;

        if (currentChain !== this.usedChain) {
          subscriber.next(`Please chosse ${this.usedNetwork} network in metamask wallet.`);
        } else {
          subscriber.next('');
        }
      });
    });

    this.accountChangedObs = new Observable((subscriber) => {
      this.wallet.on('accountChanged', () => {
        subscriber.next();
      });
    });
    this.disconnectObs = new Observable((subscriber) => {
      this.wallet.on('disconnect', (code: number, reason: string) => {
        console.log('disconnect', code, reason);
        subscriber.next(reason);
      });
    });
  }

  ethRequestAccounts() {
    return this.wallet.request({ method: 'eth_requestAccounts' });
  }

  getContract(contractName: ContractTypes) {
    return new this.web3Provider.eth.Contract(
      config[contractName].ABI as Array<any>,
      config[contractName].ADDRESS,
    );
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

      if (!currentChain || currentChain === null) {
        this.wallet
          .request({ method: 'eth_chainId' })
          .then((resChain: any) => {
            if (resChain === this.usedChain) {
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
              reject(new Error(`Please choose ${this.usedNetwork} network in metamask wallet`));
            }
          })
          .catch(() => reject(new Error('Not authorized')));
      } else if (currentChain === this.usedChain) {
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
        reject(new Error(`Please choose ${this.usedNetwork} network in metamask wallet`));
      }
    });
  }

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  get getBNBBalance() {
    return this.web3Provider.eth.getBalance(this.walletAddress);
  }

  getBalanceOf(currency: ContractTypes) {
    if (currency === 'BNB') {
      return this.getBNBBalance;
    }
    return this.getContract(currency).methods.balanceOf(this.walletAddress).call();
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(contractName: ContractTypes, tokenDecimals: number) {
    const totalSupply = await this.getContract(contractName).methods.totalSupply().call();
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

  getStartDate() {
    return this.getContract('MAIN').methods.imeStartTimestamp().call();
  }

  getEndDate() {
    // TODO: change this to normal contract later
    return this.getContract('MAIN').methods.imeEndTimestamp().call();
  }

  async getTokensForIME() {
    let length = 0;
    const tokenAddresses: string[] = [];
    // get tokens count
    await this.getContract('MAIN')
      .methods.tokenWhitelistLen()
      .call()
      .then((data: number) => {
        length = data;
      })
      .catch((err: any) => {
        console.log('error in getting tokens length', err);
      });
    // get tokens addresses
    for (let i = 0; i < length; i += 1) {
      this.getContract('MAIN')
        .methods.tokenWhitelist(i)
        .call()
        .then((data: string) => {
          tokenAddresses.push(data);
        })
        .catch((err: any) => {
          console.log(`error in getting token ${i} address`, err);
        });
    }
  }

  async checkAllowance(toContract: ContractTypes, spender?: ContractTypes) {
    try {
      const result = await this.getContract(toContract)
        .methods.allowance(this.walletAddress, config[spender || 'MAIN'].ADDRESS)
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

  mint(value: string, spenderToken: ContractTypes) {
    const mintMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'mint');
    const signature = this.encodeFunctionCall(mintMethod, [
      config[spenderToken].ADDRESS,
      MetamaskService.calcTransactionAmount(value, 18),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.MAIN.ADDRESS,
      data: signature,
      value: spenderToken === 'BNB' ? MetamaskService.calcTransactionAmount(value, 18) : '',
    });
  }

  redeem(value: string, spenderToken: ContractTypes) {
    const redeemMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'redeem');
    const signature = this.encodeFunctionCall(redeemMethod, [
      MetamaskService.calcTransactionAmount(value, 18),
      config[spenderToken].ADDRESS,
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.MAIN.ADDRESS,
      data: signature,
    });
  }

  async approve(toContract: ContractTypes, from?: ContractTypes) {
    try {
      const approveMethod = MetamaskService.getMethodInterface(config[toContract].ABI, 'approve');

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        config[from || 'MAIN'].ADDRESS,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      ]);

      return this.sendTransaction({
        from: this.walletAddress,
        to: config[toContract].ADDRESS,
        data: approveSignature,
      });
    } catch (error) {
      return error;
    }
  }

  enterIme(value: string, spenderToken: ContractTypes) {
    const methodName = spenderToken === 'BNB' ? 'enterImeNative' : 'enterImeToken';
    const mintMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, methodName);
    let signature;
    if (spenderToken !== 'BNB') {
      signature = this.encodeFunctionCall(mintMethod, [
        config[spenderToken].ADDRESS,
        MetamaskService.calcTransactionAmount(value, 18),
      ]);
    } else {
      signature = this.encodeFunctionCall(mintMethod, []);
    }

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.MAIN.ADDRESS,
      data: signature,
      value: spenderToken === 'BNB' ? MetamaskService.calcTransactionAmount(value, 18) : '',
    });
  }

  getYDRCourse(spenderToken: ContractTypes, value: string, buy: boolean, address?: string) {
    let otherTokenAddress = address;
    let path;
    if (spenderToken === 'USDT') {
      otherTokenAddress = config.USDT.ADDRESS;
    }
    if (buy) {
      path = otherTokenAddress
        ? [otherTokenAddress, config.WBNB.ADDRESS, config.YDR.ADDRESS]
        : [config.WBNB.ADDRESS, config.YDR.ADDRESS];
    } else {
      path = otherTokenAddress
        ? [config.YDR.ADDRESS, config.WBNB.ADDRESS, otherTokenAddress]
        : [config.YDR.ADDRESS, config.WBNB.ADDRESS];
    }

    return this.getContract('Router')
      .methods.getAmountsOut(MetamaskService.calcTransactionAmount(value, 18), path)
      .call();
  }

  buyYDRToken(value: string, spenderToken: ContractTypes, address?: string) {
    let methodName: 'swapExactETHForTokens' | 'swapExactTokensForTokens';
    let otherTokenAddress = address;
    switch (spenderToken) {
      case 'BNB': {
        methodName = 'swapExactETHForTokens';
        break;
      }
      case 'WBNB': {
        methodName = 'swapExactTokensForTokens';
        break;
      }
      case 'USDT': {
        // TODO: change if user can enter address of token
        otherTokenAddress = config.USDT.ADDRESS;
        methodName = 'swapExactTokensForTokens';
        break;
      }
      default: {
        methodName = 'swapExactTokensForTokens';
        break;
      }
    }

    const buyMethod = MetamaskService.getMethodInterface(config.Router.ABI, methodName);

    let signature;
    if (spenderToken !== 'BNB') {
      signature = this.encodeFunctionCall(buyMethod, [
        MetamaskService.calcTransactionAmount(value, 18),
        0,
        otherTokenAddress
          ? [otherTokenAddress, config.WBNB.ADDRESS, config.YDR.ADDRESS]
          : [config.WBNB.ADDRESS, config.YDR.ADDRESS],
        this.walletAddress,
        moment().add(30, 'minutes').format('X'),
      ]);
    } else {
      signature = this.encodeFunctionCall(buyMethod, [
        0,
        otherTokenAddress
          ? [otherTokenAddress, config.WBNB.ADDRESS, config.YDR.ADDRESS]
          : [config.WBNB.ADDRESS, config.YDR.ADDRESS],
        this.walletAddress,
        moment().add(30, 'minutes').format('X'),
      ]);
    }

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.Router.ADDRESS,
      data: signature,
      value: spenderToken === 'BNB' ? MetamaskService.calcTransactionAmount(value, 18) : '',
    });
  }

  sellYDRToken(value: string, spenderToken: ContractTypes, address?: string) {
    let methodName: 'swapExactTokensForETH' | 'swapExactTokensForTokens';
    let otherTokenAddress = address;
    switch (spenderToken) {
      case 'BNB': {
        methodName = 'swapExactTokensForETH';
        break;
      }
      case 'WBNB': {
        methodName = 'swapExactTokensForTokens';
        break;
      }
      case 'USDT': {
        // TODO: change if user can enter address of token
        otherTokenAddress = config.USDT.ADDRESS;
        methodName = 'swapExactTokensForTokens';
        break;
      }
      default: {
        methodName = 'swapExactTokensForTokens';
        break;
      }
    }

    const buyMethod = MetamaskService.getMethodInterface(config.Router.ABI, methodName);

    const signature = this.encodeFunctionCall(buyMethod, [
      MetamaskService.calcTransactionAmount(value, 18),
      '0x0000000000000000000000000000000000000000',
      otherTokenAddress
        ? [config.YDR.ADDRESS, config.WBNB.ADDRESS, otherTokenAddress]
        : [config.YDR.ADDRESS, config.WBNB.ADDRESS],
      this.walletAddress,
      moment().add(30, 'minutes').format('X'),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.Router.ADDRESS,
      data: signature,
      value: spenderToken === 'BNB' ? MetamaskService.calcTransactionAmount(value, 18) : '',
    });
  }

  createNewIndex(
    name: string,
    symbol: string,
    imeTimeParameters: string[],
    tokenAddresses: string[],
    tokenWeights: string[],
  ) {
    const method = MetamaskService.getMethodInterface(config.Factory.ABI, 'deployNewAsset');

    const signature = this.encodeFunctionCall(method, [
      name,
      symbol,
      imeTimeParameters,
      tokenAddresses,
      tokenWeights,
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.Factory.ADDRESS,
      data: signature,
    });
  }

  sendTransaction(transactionConfig: any) {
    return this.web3Provider.eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }
}
