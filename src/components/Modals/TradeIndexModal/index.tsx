import React, { useCallback, useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import config from '../../../services/web3/config';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { defaultTokens, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { Button, Input, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './TradeIndexModal.scss';

interface TradeIndexModalProps {
  token: string;
  tokenId: number;
  indexAddress: string;
}

const TradeIndexModal: React.FC<TradeIndexModalProps> = observer(
  ({ token, indexAddress, tokenId }) => {
    const url = `https://dev-ydragon.rocknblock.io/api/vaults/${tokenId}`;
    const walletConnector = useWalletConnectorContext();
    const { user, modals } = useMst();
    const [isSell, setIsSell] = useState<boolean>(modals.tradeIndex.method === 'sell');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [fee, setFee] = useState<string>('');
    const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(
      isSell ? 'YDR' : defaultTokens[0].name,
    );
    const [decimals, setDecimals] = useState<number>(18);
    const [secondCurrency, setSecondCurrency] = useState<TokenMiniNameTypes>(
      isSell ? defaultTokens[0].name : 'YDR',
    );
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
      async (currency: TokenMiniNameTypes) => {
        if (currency === 'BNB') {
          return new Promise((resolve) => resolve(18));
        }
        return walletConnector.metamaskService.getDecimals(
          config[currency].ADDRESS,
          config.Token.ABI,
        );
      },
      [walletConnector.metamaskService],
    );
    const getBalance = useCallback(() => {
      walletConnector.metamaskService
        .getBalanceOf(isSell ? indexAddress : config[firstCurrency].ADDRESS)
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
      getDecimals,
      secondCurrency,
      isSell,
      indexAddress,
      walletConnector.metamaskService,
      firstCurrency,
    ]);

    const getBuyCourse = useCallback(() => {
      if (payInput) {
        walletConnector.metamaskService
          .getIndexCourse(config[firstCurrency].ADDRESS, payInput, true, indexAddress, decimals)
          .then((data: any) => {
            setViewOnlyInputValue(
              new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
            );
            setFee(
              `${new BigNumber(data * 0.005).dividedBy(new BigNumber(10).pow(18)).toFixed(5)}`,
            );
          })
          .catch((err: ProviderRpcError) => {
            const { message } = err;
            console.log('getBuyCourse error', message);
          });
      } else {
        setViewOnlyInputValue('0.0');
        setFee('');
      }
    }, [decimals, payInput, firstCurrency, walletConnector.metamaskService, indexAddress]);
    const getSellCourse = useCallback(() => {
      if (payInput) {
        walletConnector.metamaskService
          .getIndexCourse(config[secondCurrency].ADDRESS, payInput, false, indexAddress, decimals)
          .then((data: any) => {
            axios.get(url).then((res: AxiosResponse) => {
              if (res.data[res.data.length - 1].total_x >= 0.15) {
                setFee(
                  `${new BigNumber(data * 0.02).dividedBy(new BigNumber(10).pow(18)).toFixed(5)}`,
                );
              } else {
                setFee(
                  `${new BigNumber((data * (6 - (4 - res.data[3].total_x * 100 - 5))) / 10)
                    .dividedBy(new BigNumber(10).pow(18))
                    .toFixed(5)}`,
                );
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
      viewOnlyDecimals,
      decimals,
      payInput,
      secondCurrency,
      walletConnector.metamaskService,
      indexAddress,
      url,
    ]);

    const checkAllowance = useCallback(() => {
      if (!isSell) {
        walletConnector.metamaskService
          .checkAllowanceById(
            config[firstCurrency].ADDRESS,
            config[firstCurrency].ABI,
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
    }, [isSell, indexAddress, walletConnector.metamaskService, firstCurrency]);
    const handleSelectChange = (value: any) => {
      setPayInput('');
      setViewOnlyInputValue('0.0');
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
        .approve(firstCurrency, undefined, indexAddress)
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
        .mint(payInput, firstCurrency, indexAddress, decimals)
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
        .redeem(payInput, secondCurrency, indexAddress, 18)
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
    useEffect(() => {
      setFirstCurrency(isSell ? 'YDR' : defaultTokens[0].name);
      setSecondCurrency(!isSell ? 'YDR' : defaultTokens[0].name);
    }, [isSell]);
    useEffect(() => {
      if (user.address) {
        getBalance();
      }
    }, [getBalance, user.address]);
    useEffect(() => {
      if (user.address) {
        checkAllowance();
      }
    }, [checkAllowance, user.address]);
    useEffect(() => {
      if (modals.tradeIndex.method === 'buy') {
        getBuyCourse();
      } else {
        getSellCourse();
      }
    }, [modals.tradeIndex.method, getBuyCourse, getSellCourse, payInput]);
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
                {isSell ? '' : firstCurrency}
              </span>
            </div>
            {!isSell ? (
              <InputWithSelect
                value={payInput}
                tokens={defaultTokens}
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
                tokens={defaultTokens}
                onSelectChange={handleSelectChange}
                disabled
              />
            ) : (
              <Input placeholder={viewOnlyInputValue} disabled />
            )}
          </div>
          {fee ? (
            <p className="m-trade-ydr__label m-trade-ydr__fee">
              Service Fee {fee}{' '}
              {modals.tradeIndex.method === 'buy' ? firstCurrency : secondCurrency}
            </p>
          ) : (
            <></>
          )}
          {isNeedApprove && firstCurrency !== 'BNB' && !isSell && (
            <Button className="m-trade-ydr__btn" onClick={handleApprove} loading={isLoading}>
              Approve
            </Button>
          )}
          {!isSell && (!isNeedApprove || firstCurrency === 'BNB') && (
            <Button
              className="m-trade-ydr__btn"
              onClick={handleBuy}
              disabled={!payInput}
              loading={isLoading}
            >
              Buy
            </Button>
          )}
          {isSell && !isNeedApprove && (
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
