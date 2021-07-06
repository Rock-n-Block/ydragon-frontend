import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { defaultTokens, platformToken, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { Button, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './TradeYDRModal.scss';
import config from '../../../services/web3/config';
import { ProviderRpcError } from '../../../types/errors';

const TradeYDRModal: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals } = useMst();
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(
    modals.tradeYDR.method === 'sell' ? 'YDR' : defaultTokens[0].name,
  );
  const [secondCurrency, setSecondCurrency] = useState<TokenMiniNameTypes>(
    modals.tradeYDR.method === 'sell' ? defaultTokens[0].name : 'YDR',
  );
  const [payInput, setPayInput] = useState<string>('');

  const [viewOnlyInputValue, setViewOnlyInputValue] = useState<string>('0.0');
  const [balance, setBalance] = useState<number>(0);
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const handleClose = (): void => {
    modals.tradeYDR.close();
    setPayInput('');
    setViewOnlyInputValue('0.0');
  };
  const getBalance = useCallback(() => {
    walletConnector.metamaskService
      .getBalanceOf(config[firstCurrency].ADDRESS)
      .then((data: any) => {
        console.log(`Balance: ${data} ${firstCurrency}`);
        setBalance(data);
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log('getBalance error', message);
      });
  }, [walletConnector.metamaskService, firstCurrency]);

  const getBuyCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getYDRCourse(firstCurrency, payInput, true)
        .then((data: any) => {
          console.log(`Course of ${firstCurrency} to YDR `, data[data.length - 1]);
          setViewOnlyInputValue(
            new BigNumber(data[data.length - 1]).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.log('getBuyCourse error', message);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [payInput, firstCurrency, walletConnector.metamaskService]);
  const getSellCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getYDRCourse(secondCurrency, payInput, false)
        .then((data: any) => {
          console.log(`Course of YDR  to ${secondCurrency} `, data[data.length - 1]);
          setViewOnlyInputValue(
            new BigNumber(data[data.length - 1]).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.log('getSellCourse error', message);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [payInput, secondCurrency, walletConnector.metamaskService]);

  const checkAllowance = useCallback(() => {
    walletConnector.metamaskService
      .checkAllowance(firstCurrency, 'Router')
      .then((data: boolean) => {
        console.log(`allowance of ${firstCurrency} to ${secondCurrency}: ${data} `);
        setIsNeedApprove(!data);
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log('allowance error', message);
      });
  }, [walletConnector.metamaskService, firstCurrency, secondCurrency]);
  const handleSelectChange = (value: any) => {
    setPayInput('');
    if (modals.tradeYDR.method === 'sell') {
      setSecondCurrency(value);
      getSellCourse();
    } else {
      setFirstCurrency(value);
      getBuyCourse();
    }
  };
  const handleApprove = (): void => {
    walletConnector.metamaskService
      .approve(firstCurrency, 'Router')
      .then(() => {
        setPayInput('');
        setIsNeedApprove(false);
        modals.info.setMsg('Success', `You approved YDR token`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message}`, 'error');
      });
  };
  const handleBuy = (): void => {
    walletConnector.metamaskService
      .buyYDRToken(payInput, firstCurrency)
      .then(() => {
        setPayInput('');
        getBalance();
        modals.info.setMsg('Success', `You bought YDR token`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message}`, 'error');
      });
  };
  const handleSell = (): void => {
    walletConnector.metamaskService
      .sellYDRToken(payInput, secondCurrency)
      .then(() => {
        setPayInput('');
        getBalance();
        modals.info.setMsg('Success', `You sold YDR token`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message}`, 'error');
      });
  };
  useEffect(() => {
    setFirstCurrency(modals.tradeYDR.method === 'sell' ? 'YDR' : defaultTokens[0].name);
    setSecondCurrency(modals.tradeYDR.method !== 'sell' ? 'YDR' : defaultTokens[0].name);
  }, [modals.tradeYDR.method]);
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
    if (modals.tradeYDR.method === 'buy') {
      getBuyCourse();
    } else {
      getSellCourse();
    }
  }, [modals.tradeYDR.method, getBuyCourse, getSellCourse, payInput]);
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
          <img src={YDRLogo} alt="logo" />
        </div>
        <h3 className="m-trade-ydr__header">
          I want to {modals.tradeYDR.method}
          <span className="m-trade-ydr__header-label"> ydr token</span>
        </h3>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">You pay</span>
            <span className="m-trade-ydr__label">
              Balance: {new BigNumber(balance).times(new BigNumber(10).pow(-18)).toFixed(7)}{' '}
              {firstCurrency}
            </span>
          </div>
          {modals.tradeYDR.method === 'buy' ? (
            <InputWithSelect
              value={payInput}
              tokens={defaultTokens}
              onSelectChange={handleSelectChange}
              onChange={(event) => setPayInput(event.target.value)}
              type="number"
              placeholder="0.0"
              onBlur={getBuyCourse}
            />
          ) : (
            <InputWithSelect
              value={payInput}
              onChange={(event) => setPayInput(event.target.value)}
              tokens={platformToken}
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
              tokens={defaultTokens}
              onSelectChange={handleSelectChange}
              disabled
            />
          ) : (
            <InputWithSelect
              placeholder={viewOnlyInputValue}
              tokens={platformToken}
              onSelectChange={handleSelectChange}
              disabled
            />
          )}
        </div>
        <p className="m-trade-ydr__label m-trade-ydr__fee">Service Fee 0.441 BNB</p>
        {isNeedApprove && firstCurrency !== 'BNB' && (
          <Button className="m-trade-ydr__btn" onClick={handleApprove}>
            Approve
          </Button>
        )}
        {modals.tradeYDR.method === 'buy' && (!isNeedApprove || firstCurrency === 'BNB') && (
          <Button className="m-trade-ydr__btn" onClick={handleBuy}>
            Buy
          </Button>
        )}
        {modals.tradeYDR.method === 'sell' && !isNeedApprove && (
          <Button className="m-trade-ydr__btn" onClick={handleSell}>
            Sell
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default TradeYDRModal;
