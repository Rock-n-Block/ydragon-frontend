import { ConnectWallet } from '@amfi/connect-wallet';
import { IConnect, IError } from '@amfi/connect-wallet/dist/interface';
import { chainsEnum } from '../../types';
import config, { connectWallet as connectWalletConfig, contracts } from '../../config';
import BigNumber from 'bignumber.js/bignumber';
import { rootStore } from '../../store/store';
import configABI from '../web3/config_ABI';
import WalletService, { WALLET_TYPE } from '../web3';
import Web3 from 'web3';

const { NETWORK_TOKENS } = config;

export class WalletConnect {
  public connectWallet: ConnectWallet;

  public walletAddress = '';

  public providerName: WALLET_TYPE | undefined;

  constructor() {
    this.connectWallet = new ConnectWallet();
  }

  public async initWalletConnect(
    chainName: chainsEnum,
    providerName: WALLET_TYPE,
  ): Promise<boolean> {
    return new Promise((resolve) => {
      const { provider, network, settings } = connectWalletConfig(chainName);

      const connecting = this.connectWallet
        .connect(provider[providerName], network, settings)
        .then((connected: boolean | {}) => {
          return connected;
        })
        .catch((err: any) => {
          console.error('initWalletConnect providerWallet err: ', err);
        });

      this.providerName = providerName;

      Promise.all([connecting]).then((connect: any) => {
        resolve(connect[0]);
      });
    });
  }

  public logOut(): void {
    this.connectWallet.resetConect();
  }

  public Web3(): Web3 {
    return this.connectWallet.currentWeb3();
  }

  public setAccountAddress(address: string) {
    this.walletAddress = address;
  }

  public getAccount(): Promise<IConnect | IError | { address: string }> {
    return this.connectWallet.getAccounts();
  }

  sendTransaction(transactionConfig: any) {
    return this.Web3().eth.sendTransaction({
      ...transactionConfig,
      from: this.walletAddress,
    });
  }

  static calcTransactionAmount(amount: number | string, tokenDecimal: number): string {
    return new BigNumber(amount).times(new BigNumber(10).pow(tokenDecimal)).toString(10);
  }

  static weiToEth(amount: number | string): string {
    return new BigNumber(amount).dividedBy(new BigNumber(10).pow(18)).toString(10);
  }

  isWindowEthEnabled() {
    return !!this.Web3();
  }

  /*  private getChainId(): string {
      if (this.walletType === WALLET_TYPE.METAMASK) {
        return this.Web3().chainId;
      }

      return `0x${this.wallet.chainId.toString(16)}`;
    } */

  /* switchEthereumChain(chainId: string) {
    if (this.providerName === WALLET_TYPE.METAMASK) {
      return window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
    }
    return Error(`Wallet type not ${WALLET_TYPE.METAMASK}`);
  } */

  /* static addEthereumChain(param: AddEthereumChainParameter) {
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
  } */

  /* private async requestAccounts(): Promise<string[]> {
    if (this.walletType === WALLET_TYPE.METAMASK) {
      return this.wallet.request({ method: 'eth_requestAccounts' });
    }

    return this.wallet.enable();
  } */

  /* async requestCurrentChain(): Promise<string> {
    // if (this.providerName === WALLET_TYPE.METAMASK) {
    //   return this.Web3().currentProvider.request({ method: 'eth_chainId' });
    // }

    // return `0x${}`;
    return this.Web3().givenProvider.chainId.toString(16);
  }
*/
  getContractByAddress(address: string, abi: Array<any>) {
    return this.connectWallet.getContract({ address, abi });
  }

  static getMethodInterface(abi: Array<any>, methodName: string) {
    return abi.filter((m) => {
      return m.name === methodName;
    })[0];
  }

  static delay(ms: number) {
    return new Promise((res) => setTimeout(res, ms));
  }

  async getBNBBalance() {
    // for (let i = 0; i < MAX_ATTEMPT_GET_BALANCE; i += 1) {
    //   try {
    //     if (this.walletAddress) {
    //       /* eslint-disable no-await-in-loop */
    //       const balance = await this.connectWallet.getBalance(this.walletAddress);
    //       return Number(balance);
    //     }
    //
    //     return 0;
    //   } catch (err: any) {
    //     if (i < MAX_ATTEMPT_GET_BALANCE - 1) {
    //       if (err.message === 'Network Error') {
    //         await WalletService.delay(MS_RETRY_GET_BALANCE);
    //       } else {
    //         throw new Error('Get Balance failed');
    //       }
    //     }
    //   }
    // }
    //
    // throw new Error('Get Balance failed');
    // // return this.web3Provider.eth.getBalance(this.walletAddress);
    const balance = await this.connectWallet.getBalance(this.walletAddress);
    return +balance;
  }

  async getBalanceOf(address: string) {
    if (address === '0x0000000000000000000000000000000000000000') {
      return this.getBNBBalance();
    }
    const contract = this.connectWallet.getContract({
      address,
      abi: contracts.params.Token.abi,
    });
    return contract.methods.balanceOf(this.walletAddress).call();
  }

  encodeFunctionCall(abi: any, data: Array<any>) {
    return this.Web3().eth.abi.encodeFunctionCall(abi, data);
  }

  async totalSupply(contractAddress: string, tokenDecimals: number) {
    const totalSupply = await this.getContractByAddress(contractAddress, configABI.Token.ABI)
      .methods.totalSupply()
      .call();
    return +new BigNumber(totalSupply).dividedBy(new BigNumber(10).pow(tokenDecimals)).toString(10);
  }

  getDecimals(address: string, abi: any[]) {
    return this.getContractByAddress(address, abi).methods.decimals().call();
  }

  signMsg(msg: string) {
    return this.Web3().eth.personal.sign(msg, this.walletAddress, '');
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

  rebase(indexAddress: string, tokenAddresses: string[], tokenWeights: string[]) {
    const method = WalletService.getMethodInterface(configABI.MAIN.ABI, 'rebase');
    const signature = this.encodeFunctionCall(method, [tokenAddresses, tokenWeights]);

    return this.sendTransaction({
      from: this.walletAddress,
      to: indexAddress,
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
    const isNative =
      NETWORK_TOKENS[rootStore.networks.currentNetwork as chainsEnum].symbol ===
      spenderTokenSymbol.toLowerCase();
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

  redeem(value: string, spenderTokenAddress: string, address: string, decimals: number) {
    const redeemMethod = WalletService.getMethodInterface(configABI.MAIN.ABI, 'redeem');
    const signature = this.encodeFunctionCall(redeemMethod, [
      WalletService.calcTransactionAmount(value, decimals),
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

  getStakingFactoryContract(address: string) {
    return this.getContractByAddress(address, configABI.StakingFactory.ABI);
  }

  getStakesCount(address: string) {
    return this.getStakingFactoryContract(address).methods.getStakedCount().call();
  }

  getRewardPerBlock(stakedTokenAddress: string, address: string) {
    return this.getStakingFactoryContract(address)
      .methods.rewardPerBlock(stakedTokenAddress)
      .call();
  }

  getStakeContractByIndex(index: number, address: string) {
    return this.getStakingFactoryContract(address).methods.stakes(index).call();
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
}
