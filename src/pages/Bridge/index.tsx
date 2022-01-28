import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import bscLogo from '../../assets/img/icons/blockchains/bsc.svg';
import ethLogo from '../../assets/img/icons/blockchains/eth.svg';
import avaxLogo from '../../assets/img/icons/blockchains/avax.svg';
import link from '../../assets/img/icons/icon-link.svg';
import { Button } from '../../components';
import Dropdown from '../../components/Bridge/Dropdown';
import { bridgeApi } from '../../services/api';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';

import './Bridge.scss';

/* const indexes = [
  {
    img: indexLogo,
    title: 'YDragon',
  },
]; */

// const isProduction = process.env.REACT_APP_IS_PROD === 'production';
const isProduction = false;

type ChainType = 'eth' | 'bsc' | 'avax';

const blockchains = [
  {
    key: 'eth' as ChainType,
    img: ethLogo,
    title: 'Ethereum',
    shortTitle: 'Ethereum',
    chainId: isProduction ? '0x1' : '0x2a',
    contractAddress: isProduction
      ? '0x67AC0F6872251b5e99c52a1208D992e7184EEF26'
      : '0x6C5856A05BF10553371D61617bD01854bd2670AC',
    contractId: 2,
    tokenAddress: isProduction
      ? '0x3757232B55E60da4A8793183aC030CfCE4c3865d'
      : '0x9C3A3c0ff82D79c4ee260Ee038A7c1cE93945066',

    link: isProduction
      ? 'https://kovan.etherscan.io/address/0x3757232B55E60da4A8793183aC030CfCE4c3865d'
      : 'https://kovan.etherscan.io/address/0x9C3A3c0ff82D79c4ee260Ee038A7c1cE93945066',
  },
  {
    key: 'bsc' as ChainType,
    img: bscLogo,
    title: 'Binance Smart Chain',
    shortTitle: 'BSC',
    chainId: isProduction ? '0x56' : '0x61',
    contractAddress: isProduction
      ? '0x67AC0F6872251b5e99c52a1208D992e7184EEF26'
      : '0x544E185E871CA28F4a1e2cF4f63EBE002B279839',
    contractId: 1,
    tokenAddress: isProduction
      ? '0x3757232B55E60da4A8793183aC030CfCE4c3865d'
      : '0x9C3A3c0ff82D79c4ee260Ee038A7c1cE93945066',

    link: isProduction
      ? 'https://bscscan.com/address/0x3757232B55E60da4A8793183aC030CfCE4c3865d'
      : 'https://testnet.bscscan.com/address/0x9C3A3c0ff82D79c4ee260Ee038A7c1cE93945066',
  },
  {
    key: 'avax' as ChainType,
    img: avaxLogo,
    title: 'Avalanche',
    shortTitle: 'avalanche',
    chainId: isProduction ? '0x43113' : '0xa869',
    contractAddress: isProduction ? '' : '0x544E185E871CA28F4a1e2cF4f63EBE002B279839',
    contractId: 7,
    tokenAddress: isProduction ? '' : '0x9C3A3c0ff82D79c4ee260Ee038A7c1cE93945066',

    link: isProduction
      ? 'https://snowtrace.io/address/'
      : 'https://testnet.snowtrace.io/address/0x9C3A3c0ff82D79c4ee260Ee038A7c1cE93945066',
  },
];

const tokenDecimals = 18;
const tokenSymbol = 'YDRagon';

type BlockchainInfo<T> = {
  [chain in ChainType]: T;
};

const Bridge: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals } = useMst();

  const [currentBlockchainId, setCurrentBlockchainId] = useState<string | undefined>(undefined);
  const [fromBlockchainIndex, setFromBlockchainIndex] = useState(0);
  const [toBlockchainIndex, setToBlockchainIndex] = useState(1);
  // const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);

  const [outputAmount, setOutputAmount] = useState<string>('0');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [balance, setBalance] = useState<BigNumber>(new BigNumber(0));
  const [fee, setFee] = useState<BlockchainInfo<BigNumber | undefined>>({
    eth: undefined,
    bsc: undefined,
    avax: undefined,
  });
  const [minAmount, setMinAmount] = useState<BlockchainInfo<BigNumber | undefined>>({
    eth: undefined,
    bsc: undefined,
    avax: undefined,
  });
  const [maxGasPrice, setMaxGasPrice] = useState<BlockchainInfo<BigNumber | undefined>>({
    eth: undefined,
    bsc: undefined,
    avax: undefined,
  });

  const setBlockchainIndex = useCallback((type: 'from' | 'to', index: number): void => {
    if (type === 'from') {
      setFromBlockchainIndex(index);
    } else {
      setToBlockchainIndex(index);
    }
  }, []);

  const checkChainSettings = useCallback(() => {
    return walletConnector.walletService
      .requestCurrentChain()
      .then((chainId: string) => chainId === blockchains[fromBlockchainIndex].chainId);
  }, [fromBlockchainIndex, walletConnector.walletService]);

  const checkAllowance = useCallback(async () => {
    setIsLoading(true);
    const { contractAddress, tokenAddress } = blockchains[fromBlockchainIndex];
    if (user.address && (await checkChainSettings())) {
      const isAllowed = await walletConnector.walletService.checkBridgeAllowance(
        contractAddress,
        tokenAddress,
      );
      setIsApproved(isAllowed);
    } else {
      setIsApproved(true);
    }
  }, [checkChainSettings, fromBlockchainIndex, user.address, walletConnector.walletService]);

  const handleApprove = (): void => {
    setIsLoading(true);
    const { contractAddress, tokenAddress } = blockchains[fromBlockchainIndex];
    walletConnector.walletService
      .approveBridgeToken(tokenAddress, contractAddress)
      .then(async () => {
        modals.info.setMsg('Success', `${tokenSymbol} is approved`, 'success');
        await checkAllowance();
      })
      .catch((err: any) => {
        console.debug(err);
        if (err.message.includes('insufficient funds for transfer')) {
          modals.info.setMsg('Error', `Insufficient native coins for transfer`, 'error');
        } else {
          modals.info.setMsg('Unknown error', `Please make sure you have enough balance`, 'error');
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSwap = async (): Promise<void> => {
    setIsLoading(true);

    const fromBlockchainKey = blockchains[fromBlockchainIndex].key;
    const currentGasPrice = new BigNumber(
      await walletConnector.walletService.getGasPrice(),
    ).dividedBy(10 ** 9);
    if (currentGasPrice.gt(maxGasPrice[fromBlockchainKey] as BigNumber)) {
      modals.info.setMsg('Error', `Current gas price is too high`, 'error');
      setIsLoading(false);
      return;
    }

    const { contractAddress } = blockchains[fromBlockchainIndex];
    const toBlockchain = blockchains[toBlockchainIndex].contractId;
    const amount = new BigNumber(inputAmount).multipliedBy(10 ** tokenDecimals).toFixed(0);
    walletConnector.walletService
      .swapTokensToOtherBlockchain(contractAddress, toBlockchain, amount, user.address)
      .then(() => {
        modals.info.setMsg(
          'Success',
          `Cross-chain swap of ${inputAmount} ${tokenSymbol} has started`,
          'success',
        );
      })
      .catch((err: any) => {
        console.debug(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getCurrentChainId = useCallback(() => {
    return walletConnector.walletService.requestCurrentChain().then((chainId: string) => {
      setCurrentBlockchainId(chainId);
      const blockchainIndex = blockchains.findIndex((blockchain) => blockchain.chainId === chainId);
      if (blockchainIndex !== -1) {
        setBlockchainIndex('from', blockchainIndex);
      }
    });
  }, [setBlockchainIndex, walletConnector.walletService]);

  const getBalance = useCallback(async () => {
    if (user.address && (await checkChainSettings())) {
      const { tokenAddress } = blockchains[fromBlockchainIndex];
      await walletConnector.walletService
        .getBalanceOf(tokenAddress)
        .then((tokenBalance: string) => {
          setBalance(new BigNumber(tokenBalance).dividedBy(10 ** tokenDecimals));
        });
    } else {
      setBalance(new BigNumber(0));
    }
  }, [checkChainSettings, fromBlockchainIndex, user.address, walletConnector.walletService]);

  const getFeeAndMinAmount = useCallback(async () => {
    await bridgeApi.getInfo().then((info: any) => {
      const { data } = info;
      const ethData = data.find((networkInfo: any) => networkInfo.network === 'Ethereum');
      const bscData = data.find(
        (networkInfo: any) => networkInfo.network === 'Binance-Smart-Chain',
      );
      const avaxData = data.find((networkInfo: any) => networkInfo.network === 'Avalanche');

      setFee({
        eth: new BigNumber(ethData.fee),
        bsc: new BigNumber(bscData.fee),
        avax: new BigNumber(avaxData.fee),
      });
      setMinAmount({
        eth: new BigNumber(ethData.min_amount),
        bsc: new BigNumber(bscData.min_amount),
        avax: new BigNumber(avaxData.min_amount),
      });
    });
  }, []);

  const getGasPrices = useCallback(async () => {
    const ethGasPriceInfo = (await bridgeApi.getEthGasPrice()).data.price_limit;
    const bscGasPriceInfo = (await bridgeApi.getBscGasPrice()).data.price_limit;
    const avaxGasPriceInfo = (await bridgeApi.getAvalancheGasPrice()).data.price_limit;
    setMaxGasPrice({
      eth: new BigNumber(ethGasPriceInfo),
      bsc: new BigNumber(bscGasPriceInfo),
      avax: new BigNumber(avaxGasPriceInfo),
    });
  }, []);

  useEffect(() => {
    if (user.address) {
      getCurrentChainId();
    } else {
      setIsLoading(false);
    }
  }, [getCurrentChainId, user.address]);

  useEffect(() => {
    setIsLoading(true);

    async function setParameters() {
      await Promise.all([getFeeAndMinAmount(), getGasPrices()]);

      setIsLoading(false);
    }

    setParameters();
  }, [getFeeAndMinAmount, getGasPrices]);

  useEffect(() => {
    setIsLoading(true);

    async function checkSettings() {
      setBalance(new BigNumber(0));
      try {
        await Promise.all([getBalance(), checkAllowance()]);
      } catch (err) {
        console.debug(err);
      }
      setIsLoading(false);
    }

    checkSettings();
  }, [checkAllowance, getBalance]);

  useEffect(() => {
    const blockchainFee = fee[blockchains[toBlockchainIndex].key];
    if (blockchainFee) {
      setIsLoading(true);
      if (!inputAmount) {
        setOutputAmount('0');
      } else {
        setOutputAmount(
          BigNumber.max(new BigNumber(inputAmount).minus(blockchainFee), 0).toFixed(),
        );
      }
      setIsLoading(false);
    }
  }, [inputAmount, fee, toBlockchainIndex]);

  return (
    <div className="bridge">
      <form className="form">
        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">From</div>
          </div>
          <Dropdown
            items={blockchains}
            activeIndex={fromBlockchainIndex}
            setActiveIndex={(index) => {
              if (toBlockchainIndex === index) {
                setBlockchainIndex('to', fromBlockchainIndex);
              }
              setBlockchainIndex('from', index);
            }}
          />
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">To</div>
          </div>
          <Dropdown
            items={blockchains}
            activeIndex={toBlockchainIndex}
            setActiveIndex={(index) => {
              if (fromBlockchainIndex === index) {
                setBlockchainIndex('from', toBlockchainIndex);
              }
              setBlockchainIndex('to', index);
            }}
          />
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">Amount</div>
            <a
              className="form__item__header__link"
              href={blockchains[fromBlockchainIndex].link}
              target="_blank"
              rel="noreferrer"
            >
              <div className="form__item__header__link__text">
                {blockchains[fromBlockchainIndex].shortTitle} YDR
              </div>
              <img src={link} alt="etherscan link" />
            </a>
          </div>
          <div className="gradient-box">
            <div className="box form__item__input">
              <input
                type="number"
                placeholder="Enter amount"
                value={inputAmount}
                onKeyPress={(e) => {
                  if (e.code === 'Minus') e.preventDefault();
                }}
                onChange={(e) => setInputAmount(e.target.value)}
              />
              {balance.gt(0) ? (
                <button
                  type="button"
                  className="form__item__input__send-max"
                  onClick={() => setInputAmount(balance.toFixed())}
                >
                  <span className="form__item__input__send-max__text">SEND MAX</span>
                </button>
              ) : null}
            </div>
          </div>
          <div className="form__item__footer">
            <div className="form__item__footer__fee">
              <div className="form__item__footer__fee__text">
                {`Fee: ${fee[blockchains[toBlockchainIndex].key]?.toFixed()} YDR`}
              </div>
            </div>
            <div className="form__item__footer__min-amount">
              Minimum amount: {minAmount[blockchains[fromBlockchainIndex].key]?.toFixed()} YDR
            </div>
          </div>
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">You will receive</div>
            <a
              className="form__item__header__link"
              href={blockchains[toBlockchainIndex].link}
              target="_blank"
              rel="noreferrer"
            >
              <div className="form__item__header__link__text">
                {blockchains[toBlockchainIndex].shortTitle} YDR
              </div>
              <img src={link} alt="etherscan link" />
            </a>
          </div>
          <div className="gradient-box">
            <div className="box">
              <div className="box__value">
                {user.address ? outputAmount : 'Please connect wallet'}
              </div>
            </div>
          </div>
        </div>

        <div className="form__note">
          Note: Transfer from {blockchains[fromBlockchainIndex].title} Network with Metamask wallet
        </div>

        <div className="form__submit">
          <Button
            className="token-panel__btn"
            onClick={isApproved ? handleSwap : handleApprove}
            needLogin="Please login"
            loading={isLoading}
            disabled={
              !!user.address &&
              isApproved &&
              (!inputAmount ||
                new BigNumber(inputAmount).lt(
                  minAmount[blockchains[fromBlockchainIndex].key] as BigNumber,
                ))
            }
            wrongBlockchain={
              currentBlockchainId !== blockchains[fromBlockchainIndex].chainId
                ? `Please select ${blockchains[fromBlockchainIndex].title} blockchain in your wallet`
                : null
            }
          >
            {isApproved ? 'SWAP' : 'APPROVE'}
          </Button>
        </div>
      </form>
    </div>
  );
});

export default Bridge;
