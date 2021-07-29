import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import config from '../../../services/web3/config';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { Button, Input, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './TradeIndexModal.scss';
import MetamaskService, { nativeTokens } from '../../../services/web3';
import { autorun } from 'mobx';

interface TradeIndexModalProps {
  token: string;
  tokenId: number;
  indexAddress: string;
}

const TradeIndexModal: React.FC<TradeIndexModalProps> = observer(
  ({ token, indexAddress, tokenId }) => {
    const url = `https://dev-ydragon.rocknblock.io/api/vaults/${tokenId}`;
    const walletConnector = useWalletConnectorContext();
    const { user, modals, basicTokens } = useMst();
    const [isSell, setIsSell] = useState<boolean>(modals.tradeIndex.method === 'sell');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fee, setFee] = useState<string>('');
    const [firstCurrency, setFirstCurrency] = useState<string>('');
    const [decimals, setDecimals] = useState<number>(18);
    const [secondCurrency, setSecondCurrency] = useState<string>('');
    const [payInput, setPayInput] = useState<string>('');

    const [viewOnlyInputValue, setViewOnlyInputValue] = useState<string>('0.0');
    const [viewOnlyDecimals, setViewOnlyDecimals] = useState<number>(18);

    const [balance, setBalance] = useState<number>(0);
    const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);

    const handleClose = (): void => {
      modals.tradeIndex.close();
      setPayInput('');
      setViewOnlyInputValue('0.0');
      setFee('');
    };
    const getDecimals = useCallback(
      async (currency: string) => {
        if (!currency || currency.toLowerCase() === 'bnb' || currency.toLowerCase() === 'matic') {
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
        .getBalanceOf(isSell ? indexAddress : basicTokens.getTokenAddress(firstCurrency))
        .then((data: any) => {
          setBalance(data);
          if (isSell) {
            setDecimals(18);
            getDecimals(secondCurrency).then((dec: number) => {
              setViewOnlyDecimals(dec);
            });
          } else {
            getDecimals(firstCurrency).then((dec: number) => {
              setDecimals(dec);
            });
            setViewOnlyDecimals(18);
          }
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.log('getBalance error', message);
        });
    }, [
      basicTokens,
      getDecimals,
      secondCurrency,
      isSell,
      indexAddress,
      walletConnector.metamaskService,
      firstCurrency,
    ]);

    const getFee = useCallback(
      async (currency: any, method: string, total_x?: number) => {
        let cost = 1;
        if (!nativeTokens.includes(currency.toLowerCase())) {
          try {
            const nativeCost = await walletConnector.metamaskService.getIndexCourse(
              MetamaskService.getWrappedNativeAddress(),
              payInput,
              true,
              indexAddress,
              decimals,
            );
            const currencyCost = await walletConnector.metamaskService.getIndexCourse(
              basicTokens.getTokenAddress(currency),
              payInput,
              true,
              indexAddress,
              decimals,
            );
            cost = +new BigNumber(new BigNumber(+currencyCost).dividedBy(new BigNumber(10).pow(18)))
              .dividedBy(
                new BigNumber(nativeCost).dividedBy(
                  new BigNumber(10).pow(
                    walletConnector.metamaskService.getDecimals(
                      basicTokens.getTokenAddress(currency),
                      config.Token.ABI,
                    ),
                  ),
                ),
              )
              .toFixed(5);
          } catch (e) {
            console.error(e);
          }
        }
        switch (method) {
          case 'buy':
            setFee(+payInput * cost * 0.005 > 0.001 ? `${+payInput * cost * 0.005}` : '< 0.001');
            break;
          case 'sell_0.02':
            setFee(+payInput * cost * 0.02 > 0.001 ? `${+payInput * cost * 0.02}` : '< 0.001');
            break;
          case 'sell':
            if (total_x) {
              const preFee = (+payInput * (6 - (4 - total_x - 5))) / 10;
              setFee(preFee * cost > 0.001 ? (preFee * cost).toFixed(3) : '< 0.001');
            }
            break;
          default:
            break;
        }
      },
      [basicTokens, walletConnector.metamaskService, payInput, indexAddress, decimals],
    );

    const getBuyCourse = useCallback(() => {
      if (payInput) {
        walletConnector.metamaskService
          .getIndexCourse(
            basicTokens.getTokenAddress(firstCurrency),
            payInput,
            true,
            indexAddress,
            decimals,
          )
          .then((data: any) => {
            setViewOnlyInputValue(
              new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
            );
            getFee(firstCurrency, 'buy');
          })
          .catch((err: ProviderRpcError) => {
            const { message } = err;
            console.log('getBuyCourse error', message);
          });
      } else {
        setViewOnlyInputValue('0.0');
        setFee('');
      }
    }, [
      basicTokens,
      decimals,
      payInput,
      firstCurrency,
      walletConnector.metamaskService,
      indexAddress,
      getFee,
    ]);
    const getSellCourse = useCallback(() => {
      if (payInput) {
        walletConnector.metamaskService
          .getIndexCourse(
            basicTokens.getTokenAddress(secondCurrency),
            payInput,
            false,
            indexAddress,
            decimals,
          )
          .then((data: any) => {
            axios.get(url).then((res: AxiosResponse) => {
              if (res.data[res.data.length - 1].total_x >= 0.15) {
                getFee(secondCurrency, 'sell_0.02');
              } else {
                getFee(secondCurrency, 'sell', res.data[3].total_x);
              }
            });
            setViewOnlyInputValue(
              new BigNumber(data).dividedBy(new BigNumber(10).pow(viewOnlyDecimals)).toFixed(5),
            );
          })
          .catch((err: ProviderRpcError) => {
            const { message } = err;
            console.log('getSellCourse error', message);
          });
      } else {
        setViewOnlyInputValue('0.0');
        setFee('');
      }
    }, [
      basicTokens,
      viewOnlyDecimals,
      decimals,
      payInput,
      secondCurrency,
      walletConnector.metamaskService,
      indexAddress,
      url,
      getFee,
    ]);

    const checkAllowance = useCallback(() => {
      if (!isSell) {
        walletConnector.metamaskService
          .checkAllowanceById(
            basicTokens.getTokenAddress(firstCurrency),
            config.Token.ABI,
            indexAddress,
          )
          .then((data: boolean) => {
            setIsNeedApprove(!data);
          })
          .catch((err: ProviderRpcError) => {
            const { message } = err;
            console.log('allowance error', message);
          });
      } else {
        setIsNeedApprove(false);
      }
    }, [basicTokens, isSell, indexAddress, walletConnector.metamaskService, firstCurrency]);
    const handleSelectChange = (value: any) => {
      setPayInput('');
      setViewOnlyInputValue('0.0');
      setFee('');
      if (isSell) {
        setSecondCurrency(value);
        getDecimals(value).then((dec: number) => {
          setViewOnlyDecimals(dec);
        });
      } else {
        setFirstCurrency(value);
        getDecimals(value).then((dec: number) => {
          setDecimals(dec);
        });
      }
    };
    const handleApprove = (): void => {
      setIsLoading(true);
      walletConnector.metamaskService
        // .approve(firstCurrency, undefined, indexAddress)
        .approveById(basicTokens.getTokenAddress(firstCurrency), indexAddress)
        .then(() => {
          setIsNeedApprove(false);
          modals.info.setMsg('Success', `You approved ${token}`, 'success');
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
        .mint(
          payInput,
          firstCurrency,
          basicTokens.getTokenAddress(firstCurrency),
          indexAddress,
          decimals,
        )
        .then(() => {
          setPayInput('');
          getBalance();
          modals.info.setMsg('Success', `You bought ${token}`, 'success');
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
        .redeem(payInput, basicTokens.getTokenAddress(secondCurrency), indexAddress, 18)
        .then(() => {
          setPayInput('');
          getBalance();
          modals.info.setMsg('Success', `You sold ${token}`, 'success');
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
    useEffect(() => {
      setIsSell(modals.tradeIndex.method === 'sell');
    }, [modals.tradeIndex.method]);

    const setInitialCurrencies = useCallback(() => {
      setFirstCurrency(isSell ? '' : basicTokens.tokensList[0].symbol);
      setSecondCurrency(!isSell ? '' : basicTokens.tokensList[0].symbol);
    }, [basicTokens.tokensList, isSell]);
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
    }, [basicTokens, getBalance, firstCurrency, checkAllowance, user.address]);
    useEffect(() => {
      if (basicTokens.tokensList.length) {
        if (modals.tradeIndex.method === 'buy') {
          getBuyCourse();
        } else {
          getSellCourse();
        }
      }
    }, [basicTokens, modals.tradeIndex.method, getBuyCourse, getSellCourse, payInput]);
    return (
      <Modal
        isVisible={modals.tradeIndex.isOpen}
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
            I want to {modals.tradeIndex.method}
            <span className="m-trade-ydr__header-label"> {token} token</span>
          </h3>
          <div className="m-trade-ydr__field">
            <div className="m-trade-ydr__labels">
              <span className="m-trade-ydr__label">You pay</span>
              <span className="m-trade-ydr__label">
                Balance:{' '}
                {new BigNumber(balance)
                  .times(new BigNumber(10).pow(isSell ? -18 : -decimals))
                  .toFixed(7)}{' '}
                {isSell ? '' : firstCurrency.toUpperCase()}
              </span>
            </div>
            {!isSell ? (
              <InputWithSelect
                value={payInput}
                tokens={basicTokens.tokensList.filter(
                  (currToken) => currToken.symbol.toLowerCase() !== 'ydr',
                )}
                onSelectChange={handleSelectChange}
                onChange={handlePayInput}
                type="number"
                placeholder="0.0"
                onBlur={getBuyCourse}
              />
            ) : (
              <Input
                value={payInput}
                onChange={handlePayInput}
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

            {isSell ? (
              <InputWithSelect
                placeholder={viewOnlyInputValue}
                tokens={basicTokens.tokensList.filter(
                  (currToken) => currToken.symbol.toLowerCase() !== 'ydr',
                )}
                onSelectChange={handleSelectChange}
                disabled
              />
            ) : (
              <Input placeholder={viewOnlyInputValue} disabled />
            )}
          </div>
          {fee ? (
            <p className="m-trade-ydr__label m-trade-ydr__fee">Service Fee {fee} BNB</p>
          ) : (
            <></>
          )}
          {isNeedApprove && firstCurrency !== 'bnb' && firstCurrency !== 'matic' && (
            <Button className="m-trade-ydr__btn" onClick={handleApprove} loading={isLoading}>
              Approve
            </Button>
          )}
          {!isSell && (!isNeedApprove || firstCurrency === 'bnb' || firstCurrency === 'matic') && (
            <Button
              className="m-trade-ydr__btn"
              onClick={handleBuy}
              disabled={!payInput}
              loading={isLoading}
            >
              Buy
            </Button>
          )}
          {isSell && (
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
  },
);

export default TradeIndexModal;
