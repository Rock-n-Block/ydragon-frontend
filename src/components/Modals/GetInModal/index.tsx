import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { autorun } from 'mobx';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWhiteList } from '../../../hooks/useWhiteList';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import config from '../../../services/web3/config';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { Button, Input, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './GetInModal.scss';

const GetInModal: React.FC = observer(() => {
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
      if (currency === 'bnb') {
        return new Promise((resolve) => resolve(18));
      }
      return walletConnector.metamaskService.getDecimals(
        getTokenAddress(currency),
        config.Token.ABI,
      );
    },
    [getTokenAddress, walletConnector.metamaskService],
  );
  const getBalance = useCallback(() => {
    walletConnector.metamaskService
      .getBalanceOf(getTokenAddress(firstCurrency))
      .then((data: any) => {
        setBalance(data);
        getDecimals(firstCurrency).then((dec: number) => {
          setDecimals(dec);
        });
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log('getBalance error', message);
      });
  }, [getTokenAddress, getDecimals, walletConnector.metamaskService, firstCurrency]);
  const checkAllowance = useCallback(() => {
    if (firstCurrency !== 'bnb') {
      walletConnector.metamaskService
        .checkAllowanceById(getTokenAddress(firstCurrency), config.MAIN.ABI, modals.getIn.address)
        .then((data: boolean) => {
          setIsNeedApprove(!data);
        })
        .catch((err: any) => {
          const { response } = err;
          console.log('allowance error', response);
        });
    }
  }, [getTokenAddress, modals.getIn.address, walletConnector.metamaskService, firstCurrency]);

  const handleSelectChange = (value: any) => {
    setFirstCurrency(value);
    setPayInput('');
    setIsLoading(false);

    getDecimals(value).then((dec: number) => {
      setDecimals(dec);
    });
  };

  const handleApprove = (): void => {
    setIsLoading(true);
    walletConnector.metamaskService
      .approveById(getTokenAddress(firstCurrency), modals.getIn.address)
      .then(() => {
        setIsNeedApprove(false);
        modals.info.setMsg('Success', `Approve of ${firstCurrency} to IME success`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `Approve error ${message}`, 'error');
      })
      .finally(() => setIsLoading(false));
  };

  const handleEnter = (): void => {
    setIsLoading(true);
    walletConnector.metamaskService
      .mint(payInput, firstCurrency, getTokenAddress(firstCurrency), modals.getIn.address, decimals)
      .then(() => {
        setPayInput('');
        getBalance();
        modals.info.setMsg('Success', 'You entered IME', 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg(
          'Error',
          `Enter IME error ${message.slice(0, message.indexOf(':'))}`,
          'error',
        );
      })
      .finally(() => setIsLoading(false));
  };

  const getBuyCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getIndexCourse(
          getTokenAddress(firstCurrency),
          payInput,
          true,
          modals.getIn.address,
          decimals,
        )
        .then((data: any) => {
          setViewOnlyInputValue(
            new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
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
    getTokenAddress,
    modals.getIn.address,
    decimals,
    payInput,
    firstCurrency,
    walletConnector.metamaskService,
  ]);
  const handlePayInput = (e: any) => {
    if (+e.target.value < 0) {
      e.target.value = '';
    } else {
      setPayInput(e.target.value);
    }
  };

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
      className="m-trade-ydr"
      width={390}
    >
      <div className="m-trade-ydr__content">
        <div className="m-trade-ydr__logo">
          <img src={YDRLogo} alt="logo" width="55" height="100%" />
        </div>
        <h3 className="m-trade-ydr__header">
          I want to enter to index mint event of{' '}
          <span className="m-trade-ydr__header-label"> {modals.getIn.name}</span>
        </h3>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">You pay</span>
            <span className="m-trade-ydr__label">
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
            onChange={handlePayInput}
            type="number"
            placeholder="0.0"
            onBlur={getBuyCourse}
          />
        </div>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">You Receive</span>
          </div>

          <Input placeholder={viewOnlyInputValue} disabled />
        </div>
        {isNeedApprove && firstCurrency !== 'bnb' && firstCurrency !== 'matic' && (
          <Button className="m-trade-ydr__btn" onClick={handleApprove} loading={isLoading}>
            Approve
          </Button>
        )}
        {(!isNeedApprove || firstCurrency === 'bnb' || firstCurrency === 'matic') && (
          <Button
            className="m-trade-ydr__btn"
            onClick={handleEnter}
            disabled={!payInput}
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
