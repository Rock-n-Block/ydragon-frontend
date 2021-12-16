import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWhiteList } from '../../../hooks/useWhiteList';
import { vaultsApi } from '../../../services/api';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import configABI from '../../../services/web3/config_ABI';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types';
import { Button, Input, InputWithSelect } from '../../index';
import { Modal } from '../index';
import { handleNumericInput } from '../../../utils/handleNumericInput';

import './TradeIndexModal.scss';
// import config from '../../../config';
import txToast from '../../ToastWithTxHash';
import { toast } from 'react-toastify';
import { isNativeToken } from '../../../utils/nativeTokenHelper';

interface TradeIndexModalProps {
  token: string;
  tokenId: number;
  indexAddress: string;
  updateData?: () => void;
}

const TradeIndexModal: React.FC<TradeIndexModalProps> = observer(
  ({ token, indexAddress, tokenId, updateData }) => {
    // const { NATIVE_TOKENS } = config;
    const walletConnector = useWalletConnectorContext();
    const { user, modals } = useMst();
    const [isSell, setIsSell] = useState<boolean>(modals.tradeIndex.method === 'sell');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalX, setTotalX] = useState<number>(0);
    const { whiteList, getTokenAddress } = useWhiteList(tokenId);
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
        if (!currency || isNativeToken(currency)) {
          return new Promise((resolve) => resolve(18));
        }
        return walletConnector.walletService.getDecimals(
          getTokenAddress(currency),
          configABI.Token.ABI,
        );
      },
      [getTokenAddress, walletConnector.walletService],
    );
    const getBalance = useCallback(() => {
      walletConnector.walletService
        .getBalanceOf(isSell ? indexAddress : getTokenAddress(firstCurrency))
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
          console.error('getBalance error', message);
        });
    }, [
      walletConnector.walletService,
      isSell,
      indexAddress,
      getTokenAddress,
      firstCurrency,
      getDecimals,
      secondCurrency,
    ]);

    const getFee = useCallback(() => {
      if (isSell) {
        if (totalX >= 0.15) {
          setFee('2%');
        } else if (totalX !== undefined) {
          setFee(`${(6 - (4 * (totalX * 100 - 5)) / 10).toFixed(2)}%`);
        }
      } else setFee('0.5%');
    }, [totalX, isSell]);

    const getBuyCourse = useCallback(() => {
      if (payInput) {
        try {
          walletConnector.walletService
            .getIndexCourse(getTokenAddress(firstCurrency), payInput, true, indexAddress, decimals)
            .then((data: any) => {
              setViewOnlyInputValue(
                new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
              );
            })
            .catch((err: ProviderRpcError) => {
              const { message } = err;
              console.error('getBuyCourse error', message);
            });
        } catch (error) {
          //
        }
      } else {
        setViewOnlyInputValue('0.0');
        setFee('');
      }
    }, [
      payInput,
      walletConnector.walletService,
      getTokenAddress,
      firstCurrency,
      indexAddress,
      decimals,
    ]);
    const getSellCourse = useCallback(() => {
      if (payInput) {
        try {
          walletConnector.walletService
            .getIndexCourse(
              getTokenAddress(secondCurrency),
              payInput,
              false,
              indexAddress,
              decimals,
            )
            .then((data: any) => {
              setViewOnlyInputValue(
                new BigNumber(data).dividedBy(new BigNumber(10).pow(viewOnlyDecimals)).toFixed(5),
              );
            })
            .catch((err: ProviderRpcError) => {
              const { message } = err;
              console.error('getSellCourse error', message);
            });
        } catch (error) {
          //
        }
      } else {
        setViewOnlyInputValue('0.0');
        setFee('');
      }
    }, [
      payInput,
      walletConnector.walletService,
      getTokenAddress,
      secondCurrency,
      indexAddress,
      decimals,
      viewOnlyDecimals,
    ]);

    const checkAllowance = useCallback(() => {
      if (!isSell) {
        walletConnector.walletService
          .checkAllowanceById(getTokenAddress(firstCurrency), configABI.Token.ABI, indexAddress)
          .then((data: boolean) => {
            setIsNeedApprove(!data);
          })
          .catch((err: ProviderRpcError) => {
            const { message } = err;
            console.error('allowance error', message);
          });
      } else {
        setIsNeedApprove(false);
      }
    }, [isSell, walletConnector.walletService, getTokenAddress, firstCurrency, indexAddress]);
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
      walletConnector.walletService
        .approve(getTokenAddress(firstCurrency), indexAddress)
        .on('transactionHash', (hash: string) => {
          txToast(hash);
        })
        .then(() => {
          setIsNeedApprove(false);
          toast.success(`You approved ${token}`);
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          toast.error('Something went wrong');
          setIsLoading(false);
          console.error(`Approve error `, message);
        });
    };
    const handleBuy = (): void => {
      setIsLoading(true);
      walletConnector.walletService
        .mint(payInput, firstCurrency, getTokenAddress(firstCurrency), indexAddress, decimals)
        .on('transactionHash', (hash: string) => {
          txToast(hash);
          setPayInput('');
          modals.tradeIndex.close();
          setIsLoading(false);
        })
        .then(() => {
          toast.success(`You bought ${token}`);
          if (updateData) updateData();
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          toast.error('Something went wrong');
          setIsLoading(false);
          console.error(`Buy error `, message);
        });
    };
    const handleSell = (): void => {
      setIsLoading(true);
      walletConnector.walletService
        .redeem(payInput, getTokenAddress(secondCurrency), indexAddress, 18)
        .on('transactionHash', (hash: string) => {
          txToast(hash);
          setPayInput('');
          modals.tradeIndex.close();
          setIsLoading(false);
        })
        .then(() => {
          toast.success(`You sold ${token}`);
          if (updateData) updateData();
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          toast.error('Something went wrong');
          setIsLoading(false);
          console.error(`Sell error `, message);
        });
    };

    useEffect(() => {
      setIsSell(modals.tradeIndex.method === 'sell');
    }, [modals.tradeIndex.method]);
    useEffect(() => {
      vaultsApi
        .getVaults(+tokenId)
        .then(({ data }) => {
          setTotalX(data[data.length - 1].total_x);
        })
        .catch((err) => {
          const { response } = err;
          console.error('get vaults collections error', response);
        });
    }, [tokenId]);
    const setInitialCurrencies = useCallback(() => {
      setFirstCurrency(isSell ? '' : whiteList[0].symbol);
      setSecondCurrency(!isSell ? '' : whiteList[0].symbol);
    }, [whiteList, isSell]);
    useEffect(() => {
      autorun(() => {
        if (whiteList.length) {
          setInitialCurrencies();
        }
      });
    }, [whiteList.length, setInitialCurrencies]);
    useEffect(() => {
      if (user.address && whiteList.length && firstCurrency) {
        getBalance();
        checkAllowance();
      }
    }, [getBalance, firstCurrency, checkAllowance, user.address, whiteList.length]);
    useEffect(() => {
      if (whiteList.length) {
        if (modals.tradeIndex.method === 'buy') {
          getBuyCourse();
        } else {
          getSellCourse();
        }
        getFee();
      }
    }, [getFee, whiteList.length, modals.tradeIndex.method, getBuyCourse, getSellCourse, payInput]);
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
            <span className="m-trade-ydr__header-label"> {token}</span> tokens
          </h3>
          <div className="m-trade-ydr__field">
            <div className="m-trade-ydr__labels">
              <span className="m-trade-ydr__label">You pay</span>
              <div className="m-trade-ydr__labels-box">
                <span className="m-trade-ydr__label">
                  Balance:{' '}
                  {new BigNumber(balance)
                    .times(new BigNumber(10).pow(isSell ? -18 : -decimals))
                    .toFixed(7)}{' '}
                  {isSell ? '' : firstCurrency.toUpperCase()}
                </span>
                <span
                  className="m-trade-ydr__label m-trade-ydr__label-max"
                  role="button"
                  tabIndex={0}
                  onKeyDown={() => {}}
                  onClick={() =>
                    setPayInput(
                      new BigNumber(balance)
                        .times(new BigNumber(10).pow(isSell ? -18 : -decimals))
                        .toString(10),
                    )
                  }
                >
                  MAX
                </span>
              </div>
            </div>
            {!isSell ? (
              <InputWithSelect
                value={payInput}
                tokens={whiteList}
                selectValue={firstCurrency}
                onSelectChange={handleSelectChange}
                onChange={(e) => handleNumericInput(e.target.value, setPayInput)}
                type="text"
                placeholder="0.0"
                onBlur={getBuyCourse}
              />
            ) : (
              <Input
                value={payInput}
                onChange={(e) => handleNumericInput(e.target.value, setPayInput)}
                type="text"
                placeholder="0.0"
                onBlur={getSellCourse}
              />
            )}
          </div>
          <div className="m-trade-ydr__field">
            <div className="m-trade-ydr__labels">
              <span className="m-trade-ydr__label">You Receive</span>
            </div>

            {isSell ? (
              <InputWithSelect
                placeholder={viewOnlyInputValue}
                tokens={whiteList}
                selectValue={secondCurrency}
                onSelectChange={handleSelectChange}
                disabled
              />
            ) : (
              <Input placeholder={viewOnlyInputValue} disabled />
            )}
          </div>
          {fee ? <p className="m-trade-ydr__label m-trade-ydr__fee">Service Fee {fee}</p> : <></>}
          {isNeedApprove && !isNativeToken(firstCurrency) && !isSell && (
            <Button className="m-trade-ydr__btn" onClick={handleApprove} loading={isLoading}>
              Approve
            </Button>
          )}
          {!isSell && (!isNeedApprove || isNativeToken(firstCurrency)) && (
            <Button
              className="m-trade-ydr__btn"
              onClick={handleBuy}
              disabled={!+payInput || !balance}
              loading={isLoading}
            >
              Buy
            </Button>
          )}
          {isSell && (
            <Button
              className="m-trade-ydr__btn"
              onClick={handleSell}
              disabled={!+payInput || !balance}
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
