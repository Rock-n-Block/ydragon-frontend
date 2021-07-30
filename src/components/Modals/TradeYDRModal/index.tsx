import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import config from '../../../services/web3/config';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { ITokenMini } from '../../../utils/tokenMini';
import { Button, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './TradeYDRModal.scss';

const TradeYDRModal: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals, basicTokens, networks } = useMst();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [firstCurrency, setFirstCurrency] = useState<string>(
    modals.tradeYDR.method === 'sell' ? 'YDR' : '',
  );
  const [decimals, setDecimals] = useState<number>(18);
  const [secondCurrency, setSecondCurrency] = useState<string>(
    modals.tradeYDR.method === 'sell' ? '' : 'YDR',
  );
  const [payInput, setPayInput] = useState<string>('');

  const [viewOnlyInputValue, setViewOnlyInputValue] = useState<string>('0.0');
  const [viewOnlyDecimals, setViewOnlyDecimals] = useState<number>(18);

  const [balance, setBalance] = useState<number>(0);
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const handleClose = (): void => {
    modals.tradeYDR.close();
    setPayInput('');
    setViewOnlyInputValue('0.0');
  };
  const getDecimals = useCallback(
    async (currency: string) => {
      if (currency.toLowerCase() === 'bnb' || currency.toLowerCase() === 'matic') {
        return new Promise((resolve) => resolve(18));
      }
      return walletConnector.metamaskService.getDecimals(
        basicTokens.getTokenAddress(currency),
        config.Token.ABI,
      );
    },
    [basicTokens, walletConnector.metamaskService],
  );
  const getBalance = useCallback(() => {
    walletConnector.metamaskService
      .getBalanceOf(basicTokens.getTokenAddress(firstCurrency))
      .then((data: any) => {
        setBalance(data);
        getDecimals(firstCurrency).then((dec: number) => {
          setDecimals(dec);
        });
        getDecimals(secondCurrency).then((dec: number) => {
          setViewOnlyDecimals(dec);
        });
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log('getBalance error', message);
      });
  }, [basicTokens, walletConnector.metamaskService, firstCurrency, secondCurrency, getDecimals]);

  const getBuyCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getYDRCourse(
          firstCurrency,
          basicTokens.getTokenAddress(firstCurrency),
          payInput,
          true,
          decimals,
        )
        .then((data: any) => {
          setViewOnlyInputValue(
            new BigNumber(data[data.length - 1])
              .dividedBy(new BigNumber(10).pow(viewOnlyDecimals))
              .toFixed(5),
          );
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.log('getBuyCourse error', message);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [
    basicTokens,
    decimals,
    viewOnlyDecimals,
    payInput,
    firstCurrency,
    walletConnector.metamaskService,
  ]);
  const getSellCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getYDRCourse(
          secondCurrency,
          basicTokens.getTokenAddress(secondCurrency),
          payInput,
          false,
          decimals,
        )
        .then((data: any) => {
          setViewOnlyInputValue(
            new BigNumber(data[data.length - 1])
              .dividedBy(new BigNumber(10).pow(viewOnlyDecimals))
              .toFixed(5),
          );
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.log('getSellCourse error', message);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [
    basicTokens,
    decimals,
    viewOnlyDecimals,
    payInput,
    secondCurrency,
    walletConnector.metamaskService,
  ]);

  const checkAllowance = useCallback(() => {
    walletConnector.metamaskService
      // .checkAllowance(firstCurrency, 'Router')
      .checkAllowanceById(
        basicTokens.getTokenAddress(firstCurrency),
        config.Token.ABI,
        networks.getCurrNetwork()?.router_address,
      )
      .then((data: boolean) => {
        setIsNeedApprove(!data);
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log('allowance error', message);
      });
  }, [basicTokens, networks, walletConnector.metamaskService, firstCurrency]);
  const handleSelectChange = (value: any) => {
    setPayInput('');
    setViewOnlyInputValue('0.0');
    if (modals.tradeYDR.method === 'sell') {
      setSecondCurrency(value);
      getDecimals(value).then((dec: number) => {
        setViewOnlyDecimals(dec);
      });
    } else {
      setFirstCurrency(value);
      getDecimals('YDR').then((dec: number) => {
        setViewOnlyDecimals(dec);
      });
    }
  };
  const handleApprove = (): void => {
    setIsLoading(true);
    walletConnector.metamaskService
      // .approve(firstCurrency, 'Router')
      .approveById(
        basicTokens.getTokenAddress(firstCurrency),
        networks.getCurrNetwork()?.router_address,
      )
      .then(() => {
        setIsNeedApprove(false);
        modals.info.setMsg('Success', `You approved YDR token`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message}`, 'error');
      })
      .finally(() => setIsLoading(false));
  };
  const handleBuy = (): void => {
    setIsLoading(true);
    walletConnector.metamaskService
      .buyYDRToken(payInput, firstCurrency, basicTokens.getTokenAddress(firstCurrency), decimals)
      .then(() => {
        setPayInput('');
        getBalance();
        modals.info.setMsg('Success', `You bought YDR token`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message.slice(0, message.indexOf(':'))}`, 'error');
      })
      .finally(() => setIsLoading(false));
  };
  const handleSell = (): void => {
    setIsLoading(true);
    walletConnector.metamaskService
      .sellYDRToken(payInput, secondCurrency, basicTokens.getTokenAddress(secondCurrency), decimals)
      .then(() => {
        setPayInput('');
        getBalance();
        modals.info.setMsg('Success', `You sold YDR token`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message.slice(0, message.indexOf(':'))}`, 'error');
      })
      .finally(() => setIsLoading(false));
  };
  const handlePayInput = (e: any) => {
    if (+e.target.value < 0) {
      e.target.value = '';
    } else {
      setPayInput(e.target.value);
    }
  };
  const setInitialCurrencies = useCallback(() => {
    setFirstCurrency(modals.tradeYDR.method === 'sell' ? 'YDR' : basicTokens.tokensList[0].symbol);
    setSecondCurrency(modals.tradeYDR.method !== 'sell' ? 'YDR' : basicTokens.tokensList[0].symbol);
  }, [basicTokens.tokensList, modals.tradeYDR.method]);
  useEffect(() => {
    autorun(() => {
      if (basicTokens.tokensList.length) {
        setInitialCurrencies();
      }
    });
  }, [basicTokens.tokensList.length, setInitialCurrencies]);

  useEffect(() => {
    if (user.address && basicTokens.tokensList.length && firstCurrency) {
      getBalance();
      checkAllowance();
    }
  }, [basicTokens.tokensList, firstCurrency, checkAllowance, getBalance, user.address]);

  useEffect(() => {
    if (basicTokens.tokensList.length) {
      if (modals.tradeYDR.method === 'buy') {
        getBuyCourse();
      } else {
        getSellCourse();
      }
    }
  }, [basicTokens.tokensList, modals.tradeYDR.method, getBuyCourse, getSellCourse, payInput]);
  return (
    <Modal
      isVisible={modals.tradeYDR.isOpen}
      className="m-trade-ydr"
      handleCancel={handleClose}
      closeIcon
      width={390}
    >
      <div className="m-trade-ydr__content">
        <div className="m-trade-ydr__logo">
          <img src={YDRLogo} alt="logo" width="55" height="100%" />
        </div>
        <h3 className="m-trade-ydr__header">
          I want to {modals.tradeYDR.method}
          <span className="m-trade-ydr__header-label"> ydr token</span>
        </h3>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">You pay</span>
            <span className="m-trade-ydr__label">
              Balance: {new BigNumber(balance).times(new BigNumber(10).pow(-decimals)).toFixed(7)}{' '}
              {firstCurrency.toUpperCase()}
            </span>
          </div>
          {modals.tradeYDR.method === 'buy' ? (
            <InputWithSelect
              value={payInput}
              tokens={basicTokens.tokensList.filter(
                (token) => token.symbol.toLowerCase() !== 'ydr',
              )}
              onSelectChange={handleSelectChange}
              onChange={handlePayInput}
              type="number"
              placeholder="0.0"
              onBlur={getBuyCourse}
            />
          ) : (
            <InputWithSelect
              value={payInput}
              onChange={handlePayInput}
              tokens={basicTokens.getToken('ydr') ?? ({} as ITokenMini)}
              type="number"
              placeholder="0.0"
              onBlur={getSellCourse}
            />
          )}
        </div>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">Your Receive</span>
          </div>

          {modals.tradeYDR.method === 'sell' ? (
            <InputWithSelect
              placeholder={viewOnlyInputValue}
              tokens={basicTokens.tokensList.filter(
                (token) => token.symbol.toLowerCase() !== 'ydr',
              )}
              onSelectChange={handleSelectChange}
              disabled
            />
          ) : (
            <InputWithSelect
              placeholder={viewOnlyInputValue}
              tokens={basicTokens.getToken('ydr') ?? ({} as ITokenMini)}
              onSelectChange={handleSelectChange}
              disabled
            />
          )}
        </div>
        {isNeedApprove && firstCurrency !== 'bnb' && firstCurrency !== 'matic' && (
          <Button className="m-trade-ydr__btn" onClick={handleApprove} loading={isLoading}>
            Approve
          </Button>
        )}
        {modals.tradeYDR.method === 'buy' &&
          (!isNeedApprove || firstCurrency === 'bnb' || firstCurrency === 'matic') && (
            <Button
              className="m-trade-ydr__btn"
              onClick={handleBuy}
              disabled={!payInput}
              loading={isLoading}
            >
              Buy
            </Button>
          )}
        {modals.tradeYDR.method === 'sell' && !isNeedApprove && (
          <Button
            className="m-trade-ydr__btn"
            onClick={handleSell}
            disabled={!payInput}
            loading={isLoading}
          >
            Sell
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default TradeYDRModal;
