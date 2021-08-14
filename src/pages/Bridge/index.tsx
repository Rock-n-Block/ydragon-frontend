import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import bscLogo from '../../assets/img/icons/blockchains/bsc.svg';
import ethLogo from '../../assets/img/icons/blockchains/eth.svg';
import link from '../../assets/img/icons/icon-link.svg';
import indexLogo from '../../assets/img/icons/logo-index.svg';
import { Button } from '../../components';
import Dropdown from '../../components/Bridge/Dropdown';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';

import './Bridge.scss';

const indexes = [
  {
    img: indexLogo,
    title: 'YDRagon',
  },
];

const isProduction = process.env.REACT_APP_IS_PROD === 'production';

const blockchains = [
  {
    img: ethLogo,
    title: 'Ethereum',
    shortTitle: 'Ethereum',
    chainId: isProduction ? '0x1' : '0x3',
    contractAddress: '0x3a14E30cd01a1F77e9D558A96b14724480D13b66',
    contractId: 2,
    tokenAddress: '0x741728B806E82df82E9510c5c87a37f0a1F6A4B1',
    link: `https://${
      isProduction ? '' : 'ropsten.'
    }etherscan.io/address/0x741728B806E82df82E9510c5c87a37f0a1F6A4B1`,
  },
  {
    img: bscLogo,
    title: 'Binance Smart Chain',
    shortTitle: 'BSC',
    chainId: isProduction ? '0x38' : '0x61',
    contractAddress: '0x84046c5a51A081720B11dCc0C3df64839EFF39cd',
    contractId: 1,
    tokenAddress: '0x05Ac77598AB89ec2753B58107B0c145dc93982d3',
    link: `https://${
      isProduction ? '' : 'testnet.'
    }bscscan.com/address/0x05Ac77598AB89ec2753B58107B0c145dc93982d3`,
  },
];

const tokenDecimals = 18;

const Bridge: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { user } = useMst();

  const [currentBlockchainId, setCurrentBlockchainId] = useState<string | undefined>(undefined);
  const [fromBlockchainIndex, setFromBlockchainIndex] = useState(0);
  const [toBlockchainIndex, setToBlockchainIndex] = useState(1);
  const [activeTokenIndex, setActiveTokenIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproved, setIsApproved] = useState(false);
  const [fee, setFee] = useState<BigNumber | undefined>(undefined);
  const [minAmount, setMinAmount] = useState<BigNumber | undefined>(undefined);
  const [outputAmount, setOutputAmount] = useState<string>('0');
  const [inputAmount, setInputAmount] = useState<string>('');

  const setBlockchainIndex = useCallback((type: 'from' | 'to', index: number): void => {
    const oppositeIndex = index === 0 ? 1 : 0;
    if (type === 'from') {
      setFromBlockchainIndex(index);
      setToBlockchainIndex(oppositeIndex);
    } else {
      setToBlockchainIndex(index);
      setFromBlockchainIndex(oppositeIndex);
    }
  }, []);

  const handleApprove = (): void => {
    setIsLoading(true);
    const { contractAddress, tokenAddress } = blockchains[fromBlockchainIndex];
    walletConnector.metamaskService
      .approveById(tokenAddress, contractAddress)
      .then(() => {
        console.log('approved!');
      })
      .catch((err: any) => {
        console.debug(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSwap = (): void => {
    setIsLoading(true);
    const { contractAddress } = blockchains[fromBlockchainIndex];
    const toBlockchain = blockchains[toBlockchainIndex].contractId;
    const amount = new BigNumber(inputAmount).multipliedBy(10 ** tokenDecimals).toFixed(0);
    walletConnector.metamaskService
      .swapTokensToOtherBlockchain(contractAddress, toBlockchain, amount, user.address)
      .then(() => {
        console.log('swapped!');
        setIsApproved(true);
      })
      .catch((err: any) => {
        console.debug(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getCurrentChainId = useCallback(() => {
    return walletConnector.metamaskService.ethGetCurrentChain().then((chainId: string) => {
      setCurrentBlockchainId(chainId);
      const blockchainIndex = blockchains.findIndex((blockchain) => blockchain.chainId === chainId);
      setBlockchainIndex('from', blockchainIndex);
    });
  }, [setBlockchainIndex, walletConnector.metamaskService]);

  const checkAllowance = useCallback(async () => {
    setIsLoading(true);
    const { contractAddress, tokenAddress } = blockchains[fromBlockchainIndex];
    if (user.address) {
      const isAllowed = await walletConnector.metamaskService.checkBridgeAllowance(
        contractAddress,
        tokenAddress,
      );
      setIsApproved(isAllowed);
    } else {
      setIsApproved(false);
    }
  }, [fromBlockchainIndex, user.address, walletConnector.metamaskService]);

  const getFee = useCallback(async () => {
    const { contractAddress } = blockchains[fromBlockchainIndex];
    const toBlockchain = blockchains[toBlockchainIndex].contractId;
    const feeAbsolute = await walletConnector.metamaskService.getBridgeFee(
      contractAddress,
      toBlockchain,
    );
    setFee(new BigNumber(feeAbsolute).dividedBy(10 ** tokenDecimals));
  }, [fromBlockchainIndex, toBlockchainIndex, walletConnector.metamaskService]);

  const getMinAmount = useCallback(async () => {
    const { contractAddress } = blockchains[fromBlockchainIndex];
    const minAmountAbsolute = await walletConnector.metamaskService.getBridgeMinAmount(
      contractAddress,
    );
    setMinAmount(new BigNumber(minAmountAbsolute).dividedBy(10 ** tokenDecimals));
  }, [fromBlockchainIndex, walletConnector.metamaskService]);

  useEffect(() => {
    if (user.address) {
      getCurrentChainId();
    } else {
      setIsLoading(false);
    }
  }, [getCurrentChainId, user.address]);

  useEffect(() => {
    setIsLoading(true);
    console.log('useEffect');

    async function checkSettings() {
      setFee(undefined);
      setMinAmount(undefined);

      await checkAllowance();
      await getFee();
      await getMinAmount();

      setIsLoading(false);
    }

    checkSettings();
  }, [checkAllowance, getFee, getMinAmount]);

  useEffect(() => {
    if (fee) {
      setIsLoading(true);
      if (!inputAmount) {
        setOutputAmount('0');
      } else {
        setOutputAmount(new BigNumber(inputAmount).minus(fee).toFixed());
      }
      setIsLoading(false);
    }
  }, [inputAmount, fee]);

  return (
    <div className="bridge">
      <form className="form">
        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">Choose Token</div>
          </div>
          <Dropdown
            items={indexes}
            activeIndex={activeTokenIndex}
            setActiveIndex={setActiveTokenIndex}
          />
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">From</div>
          </div>
          <Dropdown
            items={blockchains}
            activeIndex={fromBlockchainIndex}
            setActiveIndex={(index) => setBlockchainIndex('from', index)}
          />
        </div>

        <div className="form__item">
          <div className="form__item__header">
            <div className="form__item__header__title">To</div>
          </div>
          <Dropdown
            items={blockchains}
            activeIndex={toBlockchainIndex}
            setActiveIndex={(index) => setBlockchainIndex('to', index)}
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
                {blockchains[fromBlockchainIndex].shortTitle} KYP
              </div>
              <img src={link} alt="etherscan link" />
            </a>
          </div>
          <div className="gradient-box">
            <div className="box form__item__input">
              <input
                type="text"
                placeholder="Enter amount"
                onChange={(e) => setInputAmount(e.target.value)}
              />
              <div className="form__item__input__send-max">
                <div className="form__item__input__send-max__text">SEND MAX</div>
              </div>
            </div>
          </div>
          <div className="form__item__footer">
            <div className="form__item__footer__fee">
              <div className="form__item__footer__fee__text">Fee: {fee?.toFixed()}</div>
            </div>
            <div className="form__item__footer__min-amount">
              Minimum amount: {minAmount?.toFixed()} KYP
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
                {blockchains[toBlockchainIndex].shortTitle} KYP
              </div>
              <img src={link} alt="etherscan link" />
            </a>
          </div>
          <div className="gradient-box">
            <div className="box">
              <div className="box__value">
                {user.address ? outputAmount : 'Please, connect wallet'}
              </div>
            </div>
          </div>
        </div>

        <div className="form__note">Note: Transfer from Ethereum Network with Metamask wallet</div>

        <div className="form__submit">
          <Button
            className="token-panel__btn"
            onClick={isApproved ? handleSwap : handleApprove}
            needLogin="Please login"
            loading={isLoading}
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
