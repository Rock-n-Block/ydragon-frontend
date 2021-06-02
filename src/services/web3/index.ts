import BigNumber from 'bignumber.js/bignumber';
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
export type SpenderTypes = 'WBNB' | 'YDR' | 'USDT';

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

  public contract: any;

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
    this.web3Provider = new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    window.ethereum.enable();

    this.web3Provider = new Web3(window.ethereum);
    this.testnet = testnet;
    this.isProduction = isProduction;
    this.contract = new this.web3Provider.eth.Contract(config.ABI as Array<any>, config.ADDRESS);

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

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.web3Provider.eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(tokenDecimals: number) {
    const totalSupply = await this.contract.methods.totalSupply().call();
    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  static calcTransactionAmount(amount: number | string, tokenDecimal: number) {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  signMsg(msg: string) {
    return this.web3Provider.eth.personal.sign(msg, this.walletAddress, '');
  }

  getStartDate() {
    return this.contract.methods.imeStartTimestamp().call();
  }

  getEndDate() {
    return this.contract.methods.imeEndTimestamp().call();
  }

  async checkAllowance(spender: SpenderTypes) {
    try {
      const result = await this.contract.methods
        .allowance(this.walletAddress, config.SPENDER_ADDRESS[spender])
        .call();

      if (result === '0') return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  /*  async checkAllAllowance() {
    const wbnbAllowance = await this.checkAllowance('WBNB');
    console.log('wbnbAllowance', wbnbAllowance);
    const ydtAllowance = await this.checkAllowance('YDT');
    console.log('ydtAllowance', ydtAllowance);
    const usdtAllowance = await this.checkAllowance('USDT');
    console.log('usdtAllowance', usdtAllowance);
    if (wbnbAllowance || ydtAllowance || usdtAllowance) return true;
    return false;
  } */

  async approve(spender: SpenderTypes) {
    try {
      const totalSupply = await this.totalSupply(18);

      const approveMethod = MetamaskService.getMethodInterface(config.ABI, 'approve');

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        config.SPENDER_ADDRESS[spender],
        totalSupply,
      ]);

      return this.sendTransaction({
        from: this.walletAddress,
        to: config.ADDRESS,
        data: approveSignature,
      });
    } catch (error) {
      return error;
    }
  }

  sendTransaction(transactionConfig: any) {
    return this.web3Provider.eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }
}
