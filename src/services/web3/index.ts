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

export type TestNetworkTypes = 'bnbt' | 'tmatic';

interface IMetamaskService {
  isProduction?: boolean;
}

export type ContractTypes =
  | 'BNB'
  | 'WBNB'
  | 'MAIN'
  | 'USDT'
  | 'YDR'
  | 'Router'
  | 'Factory'
  | 'Staking'
  | 'DexFactory'
  | 'Token';

const networks: INetworks = {
  mainnet: '0x1',
};
const testNetworks: INetworks = {
  bnbt: '0x61',
  tmatic: '0x13881',
};

export default class MetamaskService {
  public wallet;

  public web3Provider;

  // public contract: any;

  private isProduction?: boolean;

  public walletAddress = '';

  public chainChangedObs: any;

  public accountChangedObs: any;

  public disconnectObs: any;

  public usedNetwork: string;

  public usedChain: INetworks;

  constructor({ isProduction = false }: IMetamaskService) {
    this.wallet = window.ethereum;

    this.web3Provider = new Web3(window.ethereum);
    this.isProduction = isProduction;
    // this.contract = new this.web3Provider.eth.Contract(config.ABI as Array<any>, config.ADDRESS);

    this.usedNetwork = this.isProduction ? 'mainnet' : 'testnet';
    this.usedChain = this.isProduction ? networks : testNetworks;

    this.chainChangedObs = new Observable((subscriber) => {
      this.wallet.on('chainChanged', () => {
        const currentChain = this.wallet.chainId;
        if (!Object.values(this.usedChain).find((chainId) => chainId === currentChain)) {
          subscriber.next(`Please choose one of networks in header select.`);
        } else {
          rootStore.networks.setId(this.wallet.chainId);
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

  getStartDate(address: string) {
    return this.getContractByAddress(address, config.MAIN.ABI).methods.imeStartTimestamp().call();
  }

  getEndDate(address: string) {
    // TODO: change this to normal contract later
    return this.getContractByAddress(address, config.MAIN.ABI).methods.imeEndTimestamp().call();
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

  async checkAllowance(toContract: ContractTypes, spender?: ContractTypes, address?: string) {
    try {
      const result = await this.getContract(toContract)
        .methods.allowance(this.walletAddress, address || config[spender || 'MAIN'].ADDRESS)
        .call();

      if (result === '0') return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkAllowanceById(toContract: string, abi: Array<any>, spenderAddress: string) {
    try {
      const result = await this.getContractByAddress(toContract, abi)
        .methods.allowance(this.walletAddress, spenderAddress)
        .call();

      if (result === '0') return false;
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkStakingAllowance(tokenAddress: string) {
    try {
      const result = await this.getContractByAddress(tokenAddress, config.Token.ABI)
        .methods.allowance(this.walletAddress, config.Staking.ADDRESS)
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

  mint(value: string, spenderToken: ContractTypes, address: string, decimals: number) {
    const mintMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'mint');
    const signature = this.encodeFunctionCall(mintMethod, [
      config[spenderToken].ADDRESS,
      MetamaskService.calcTransactionAmount(value, decimals),
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: address,
      data: signature,
      value: spenderToken === 'BNB' ? MetamaskService.calcTransactionAmount(value, decimals) : '',
    });
  }

  redeem(value: string, spenderToken: ContractTypes, address: string, decimals: number) {
    const redeemMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'redeem');
    const signature = this.encodeFunctionCall(redeemMethod, [
      MetamaskService.calcTransactionAmount(value, decimals),
      config[spenderToken].ADDRESS,
    ]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: address,
      data: signature,
    });
  }

  async approve(toContract: ContractTypes, from?: ContractTypes, address?: string) {
    try {
      const approveMethod = MetamaskService.getMethodInterface(config[toContract].ABI, 'approve');

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        address || config[from || 'MAIN'].ADDRESS,
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

  async approveById(toContractAdress: string, address?: string) {
    try {
      const approveMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, 'approve');

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        address,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      ]);

      return this.sendTransaction({
        from: this.walletAddress,
        to: toContractAdress,
        data: approveSignature,
      });
    } catch (error) {
      return error;
    }
  }

  async approveStake(address: string) {
    try {
      const approveMethod = MetamaskService.getMethodInterface(config.Token.ABI, 'approve');

      const approveSignature = this.encodeFunctionCall(approveMethod, [
        config.Staking.ADDRESS,
        '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
      ]);

      return this.sendTransaction({
        from: this.walletAddress,
        to: address,
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
    const mintMethod = MetamaskService.getMethodInterface(config.MAIN.ABI, methodName);
    let signature;
    if (!isBnb) {
      signature = this.encodeFunctionCall(mintMethod, [
        spenderTokenAddress,
        MetamaskService.calcTransactionAmount(value, decimals),
      ]);
    } else {
      signature = this.encodeFunctionCall(mintMethod, []);
    }

    return this.sendTransaction({
      from: this.walletAddress,
      to: imeAddress,
      data: signature,
      value: isBnb ? MetamaskService.calcTransactionAmount(value, decimals) : '',
    });
  }

  getYDRCourse(spenderToken: ContractTypes, value: string, buy: boolean, decimals: number) {
    let otherTokenAddress /* = address */;
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

  async buyYDRToken(value: string, spenderToken: ContractTypes, decimals: number) {
    let methodName: 'swapExactETHForTokens' | 'swapExactTokensForTokens';
    let otherTokenAddress /* = address */;
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
        MetamaskService.calcTransactionAmount(value, decimals),
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
      value: spenderToken === 'BNB' ? MetamaskService.calcTransactionAmount(value, decimals) : '',
    });
  }

  sellYDRToken(value: string, spenderToken: ContractTypes, decimals: number) {
    let methodName: 'swapExactTokensForETH' | 'swapExactTokensForTokens';
    let otherTokenAddress /* = address */;
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

    const sellMethod = MetamaskService.getMethodInterface(config.Router.ABI, methodName);

    const signature = this.encodeFunctionCall(sellMethod, [
      MetamaskService.calcTransactionAmount(value, decimals),
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
    });
  }

  harvestStakeItem(id: string | number) {
    const method = MetamaskService.getMethodInterface(config.Staking.ABI, 'claimDividends');

    const signature = this.encodeFunctionCall(method, [id, '0']);

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.Staking.ADDRESS,
      data: signature,
    });
  }

  endStake(id: string | number) {
    const method = MetamaskService.getMethodInterface(config.Staking.ABI, 'stakeEnd');

    const signature = this.encodeFunctionCall(method, [id]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: config.Staking.ADDRESS,
      data: signature,
    });
  }

  getStakingTokensLen() {
    return this.getContract('Staking').methods.tokensToEnterLen().call();
  }

  getStakingTokenToEnter(index: number) {
    return this.getContract('Staking').methods.tokensToEnter(index).call();
  }

  getStakingPair(address: string) {
    return this.getContract('DexFactory').methods.getPair(address, config.WBNB.ADDRESS).call();
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
      to: config.Staking.ADDRESS,
      data: signature,
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
