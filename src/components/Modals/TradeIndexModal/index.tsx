import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { defaultTokens, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { Button, Input, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './TradeIndexModal.scss';
import config from '../../../services/web3/config';
import { ProviderRpcError } from '../../../types/errors';

interface TradeIndexModalProps {
  token: string;
  indexAddress: string;
}

const TradeIndexModal: React.FC<TradeIndexModalProps> = observer(({ token, indexAddress }) => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals } = useMst();
  const [isSell, setIsSell] = useState<boolean>(modals.tradeIndex.method === 'sell');
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(
    isSell ? 'YDR' : defaultTokens[0].name,
  );
  const [secondCurrency, setSecondCurrency] = useState<TokenMiniNameTypes>(
    isSell ? defaultTokens[0].name : 'YDR',
  );
  const [payInput, setPayInput] = useState<string>('');

  const [viewOnlyInputValue, setViewOnlyInputValue] = useState<string>('0.0');
  const [balance, setBalance] = useState<number>(0);
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const handleClose = (): void => {
    modals.tradeIndex.close();
    setPayInput('');
    setViewOnlyInputValue('0.0');
  };
  const getBalance = useCallback(() => {
    walletConnector.metamaskService
      .getBalanceOf(isSell ? indexAddress : config[firstCurrency].ADDRESS)
      .then((data: any) => {
        setBalance(data);
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log('getBalance error', message);
      });
  }, [isSell, indexAddress, walletConnector.metamaskService, firstCurrency]);

  const getBuyCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getIndexCourse(config[firstCurrency].ADDRESS, payInput, true, indexAddress)
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
  }, [payInput, firstCurrency, walletConnector.metamaskService, indexAddress]);
  const getSellCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getIndexCourse(config[secondCurrency].ADDRESS, payInput, false, indexAddress)
        .then((data: any) => {
          setViewOnlyInputValue(
            new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.log('getSellCourse error', message);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [payInput, secondCurrency, walletConnector.metamaskService, indexAddress]);

  const checkAllowance = useCallback(() => {
    if (!isSell) {
      walletConnector.metamaskService
        .checkAllowanceById(config[firstCurrency].ADDRESS, config[firstCurrency].ABI, indexAddress)
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
    if (isSell) {
      setSecondCurrency(value);
    } else {
      setFirstCurrency(value);
    }
  };
  const handleApprove = (): void => {
    walletConnector.metamaskService
      .approve(firstCurrency, undefined, indexAddress)
      .then(() => {
        setIsNeedApprove(false);
        modals.info.setMsg('Success', `You approved ${token}`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message}`, 'error');
      });
  };
  const handleBuy = (): void => {
    walletConnector.metamaskService
      .mint(payInput, firstCurrency, indexAddress)
      .then(() => {
        modals.info.setMsg('Success', `You bought ${token}`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message}`, 'error');
      });
  };
  const handleSell = (): void => {
    walletConnector.metamaskService
      .redeem(payInput, secondCurrency, indexAddress)
      .then(() => {
        modals.info.setMsg('Success', `You sold ${token}`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `${message}`, 'error');
      });
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
          <img src={YDRLogo} alt="logo" />
        </div>
        <h3 className="m-trade-ydr__header">
          I want to {modals.tradeIndex.method}
          <span className="m-trade-ydr__header-label"> {token} token</span>
        </h3>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">You pay</span>
            <span className="m-trade-ydr__label">
              Balance: {new BigNumber(balance).times(new BigNumber(10).pow(-18)).toFixed(7)}{' '}
              {isSell ? '' : firstCurrency}
            </span>
          </div>
          {!isSell ? (
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
            <Input
              value={payInput}
              onChange={(event) => setPayInput(event.target.value)}
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
        <p className="m-trade-ydr__label m-trade-ydr__fee">Service Fee 0.441 BNB</p>
        {isNeedApprove && firstCurrency !== 'BNB' && (
          <Button className="m-trade-ydr__btn" onClick={handleApprove}>
            Approve
          </Button>
        )}
        {!isSell && (!isNeedApprove || firstCurrency === 'BNB') && (
          <Button className="m-trade-ydr__btn" onClick={handleBuy}>
            Buy
          </Button>
        )}
        {isSell && !isNeedApprove && (
          <Button className="m-trade-ydr__btn" onClick={handleSell}>
            Sell
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default TradeIndexModal;
