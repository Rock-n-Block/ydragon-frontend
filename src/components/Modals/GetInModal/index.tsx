import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWhiteList } from '../../../hooks/useWhiteList';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import configABI from '../../../services/web3/config_ABI';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types';
import { Button, Input, InputWithSelect } from '../../index';
import { Modal } from '../index';
import { handleNumericInput } from '../../../utils/handleNumericInput';

import './GetInModal.scss';
import txToast from '../../ToastWithTxHash';
import { toast } from 'react-toastify';
import { isNativeToken } from '../../../utils/nativeTokenHelper';

const GetInModal: React.FC = observer(() => {
  // const { NETWORK_TOKENS } = config;
  const { modals, user } = useMst();
  const { whiteList, getTokenAddress } = useWhiteList(modals.getIn.id ?? 0);
  const walletConnector = useWalletConnectorContext();

  const [firstCurrency, setFirstCurrency] = useState<string>('');
  const [decimals, setDecimals] = useState<number>(18);
  const [payInput, setPayInput] = useState<string>('');
  const [viewOnlyInputValue, setViewOnlyInputValue] = useState<string>('0.0');
  const [balance, setBalance] = useState<number>(0);
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleClose = (): void => {
    modals.getIn.close();
    setPayInput('');
  };

  const getDecimals = useCallback(
    async (currency: string) => {
      if (isNativeToken(currency)) {
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
      .getBalanceOf(getTokenAddress(firstCurrency))
      .then((data: any) => {
        setBalance(data);
        getDecimals(firstCurrency).then((dec: number) => {
          setDecimals(dec);
        });
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.error('getBalance error', message);
      });
  }, [getTokenAddress, getDecimals, walletConnector.walletService, firstCurrency]);
  const checkAllowance = useCallback(() => {
    if (!isNativeToken(firstCurrency)) {
      walletConnector.walletService
        .checkAllowanceById(
          getTokenAddress(firstCurrency),
          configABI.MAIN.ABI,
          modals.getIn.address || '',
        )
        .then((data: boolean) => {
          setIsNeedApprove(!data);
        })
        .catch((err: any) => {
          const { response } = err;
          console.error('allowance error', response);
        });
    }
  }, [firstCurrency, walletConnector.walletService, getTokenAddress, modals.getIn.address]);

  const handleSelectChange = (value: any) => {
    setFirstCurrency(value);
    setPayInput('');
    setViewOnlyInputValue('0.0');
    setIsLoading(false);

    getDecimals(value).then((dec: number) => {
      setDecimals(dec);
    });
  };

  const handleApprove = (): void => {
    setIsLoading(true);
    walletConnector.walletService
      .approve(getTokenAddress(firstCurrency), modals.getIn.address || '')
      .on('transactionHash', (hash: string) => {
        txToast(hash);
      })
      .then(() => {
        setIsNeedApprove(false);
        toast.success(`Approve of ${firstCurrency} to IMO success`);
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        toast.error('Something went wrong');
        console.error(`Approve error`, message);
      })
      .finally(() => setIsLoading(false));
  };
  const handleEnter = (): void => {
    setIsLoading(true);
    walletConnector.walletService
      .mint(
        payInput,
        firstCurrency,
        getTokenAddress(firstCurrency),
        modals.getIn.address || '',
        decimals,
      )
      .on('transactionHash', (hash: string) => {
        txToast(hash);
        setPayInput('');
        modals.getIn.close();
        setIsLoading(false);
      })
      .then(() => {
        toast.success('You entered IMO');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        toast.error('Something went wrong');
        console.error(`Enter IMO error `, message);
      });
  };

  const getBuyCourse = useCallback(() => {
    if (payInput) {
      walletConnector.walletService
        .getIndexCourse(
          getTokenAddress(firstCurrency),
          payInput,
          true,
          modals.getIn.address || '',
          decimals,
        )
        .then((data: any) => {
          setViewOnlyInputValue(
            new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.error('getBuyCourse error', message);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [
    getTokenAddress,
    modals.getIn.address,
    decimals,
    payInput,
    firstCurrency,
    walletConnector.walletService,
  ]);

  const setInitialCurrencies = useCallback(() => {
    setFirstCurrency(whiteList[0].symbol);
  }, [whiteList]);

  useEffect(() => {
    autorun(() => {
      if (whiteList.length) {
        setInitialCurrencies();
      }
    });
  }, [whiteList, setInitialCurrencies]);

  useEffect(() => {
    if (user.address && whiteList.length && firstCurrency) {
      getBalance();
      checkAllowance();
    }
  }, [whiteList.length, checkAllowance, user.address, firstCurrency, getBalance]);
  return (
    <Modal
      isVisible={!!modals.getIn.id}
      handleCancel={handleClose}
      className="m-get-in"
      width={390}
    >
      <div className="m-get-in__content">
        <div className="m-get-in__logo">
          <img src={YDRLogo} alt="logo" width="55" height="100%" />
        </div>
        <h3 className="m-get-in__header">
          I want to buy <span className="m-get-in__header-label"> {modals.getIn.name}</span> tokens
        </h3>
        <div className="m-get-in__field">
          <div className="m-get-in__labels">
            <span className="m-get-in__label">You pay</span>
            <span className="m-get-in__label">
              Balance:{' '}
              {new BigNumber(balance).dividedBy(new BigNumber(10).pow(decimals)).toFixed(7)}{' '}
              {firstCurrency.toUpperCase()}
            </span>
          </div>
          <InputWithSelect
            key="get-in_pay-input"
            value={payInput}
            tokens={whiteList}
            selectValue={firstCurrency || ''}
            onSelectChange={handleSelectChange}
            onChange={(e) => handleNumericInput(e.target.value, setPayInput)}
            type="text"
            placeholder="0.0"
            onBlur={getBuyCourse}
          />
        </div>
        <div className="m-get-in__field">
          <div className="m-get-in__labels">
            <span className="m-get-in__label">You Receive</span>
          </div>

          <Input placeholder={viewOnlyInputValue} disabled />
        </div>
        {isNeedApprove && !isNativeToken(firstCurrency) && (
          <Button className="m-get-in__btn" onClick={handleApprove} loading={isLoading}>
            Approve
          </Button>
        )}
        {(!isNeedApprove || isNativeToken(firstCurrency)) && (
          <Button
            className="m-get-in__btn"
            onClick={handleEnter}
            disabled={!payInput || !balance}
            loading={isLoading}
          >
            Buy
          </Button>
        )}
      </div>
    </Modal>
  );
});
export default GetInModal;
