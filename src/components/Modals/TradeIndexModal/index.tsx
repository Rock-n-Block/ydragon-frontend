import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../../assets/img/icons/logo.svg';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { defaultTokens, platformToken, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { Button, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './TradeIndexModal.scss';

interface TradeIndexModalProps {
  token: string;
}

const TradeIndexModal: React.FC<TradeIndexModalProps> = observer(({ token }) => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals } = useMst();
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(
    modals.tradeIndex.method === 'sell' ? 'YDR' : defaultTokens[0].name,
  );
  const [secondCurrency, setSecondCurrency] = useState<TokenMiniNameTypes>(
    modals.tradeIndex.method === 'sell' ? defaultTokens[0].name : 'YDR',
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
      .getBalanceOf(firstCurrency)
      .then((data: any) => {
        console.log(`Balance: ${data} ${firstCurrency}`);
        setBalance(data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('getBalance error', response);
      });
  }, [walletConnector.metamaskService, firstCurrency]);

  const getBuyCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getYDRCourse(firstCurrency, payInput, true)
        .then((data: any) => {
          console.log(`Cource of ${firstCurrency} to ${token} `, data[data.length - 1]);
          setViewOnlyInputValue(
            new BigNumber(data[data.length - 1]).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: any) => {
          const { response } = err;
          console.log('getCource error', response);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [payInput, firstCurrency, walletConnector.metamaskService, token]);
  const getSellCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getYDRCourse(secondCurrency, payInput, false)
        .then((data: any) => {
          console.log(`Cource of ${token}  to ${secondCurrency} `, data[data.length - 1]);
          setViewOnlyInputValue(
            new BigNumber(data[data.length - 1]).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: any) => {
          const { response } = err;
          console.log('getCource error', response);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [payInput, secondCurrency, walletConnector.metamaskService, token]);

  const checkAllowance = useCallback(() => {
    walletConnector.metamaskService
      .checkAllowance(firstCurrency, 'Router')
      .then((data: boolean) => {
        console.log(`allowance of ${firstCurrency} to ${secondCurrency}: ${data} `);
        setIsNeedApprove(!data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('allowance error', response);
      });
  }, [walletConnector.metamaskService, firstCurrency, secondCurrency]);
  const handleSelectChange = (value: any) => {
    if (modals.tradeIndex.method === 'sell') {
      setSecondCurrency(value);
      setPayInput('');
      getSellCourse();
    } else {
      setFirstCurrency(value);
      getBuyCourse();
    }
  };
  const handleApprove = (): void => {
    walletConnector.metamaskService
      .approve(firstCurrency, 'Router')
      .then((data: any) => {
        setPayInput('');
        setIsNeedApprove(false);
        console.log(`approve of ${firstCurrency} to ${secondCurrency} success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('approve error', response);
      });
  };
  const handleBuy = (): void => {
    walletConnector.metamaskService
      .buyYDRToken(payInput, firstCurrency)
      .then((data: any) => {
        setPayInput('');
        console.log(`buy of ${secondCurrency} for ${firstCurrency} success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('buy error', response);
      });
  };
  const handleSell = (): void => {
    walletConnector.metamaskService
      .sellYDRToken(payInput, secondCurrency)
      .then((data: any) => {
        setPayInput('');
        console.log(`sell of ${firstCurrency} for ${secondCurrency} success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('sell error', response);
      });
  };
  useEffect(() => {
    setFirstCurrency(modals.tradeIndex.method === 'sell' ? 'YDR' : defaultTokens[0].name);
    setSecondCurrency(modals.tradeIndex.method !== 'sell' ? 'YDR' : defaultTokens[0].name);
  }, [modals.tradeIndex.method]);
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
              {firstCurrency}
            </span>
          </div>
          {modals.tradeIndex.method === 'buy' ? (
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

          {modals.tradeIndex.method === 'sell' ? (
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
        {modals.tradeIndex.method === 'buy' && (!isNeedApprove || firstCurrency === 'BNB') && (
          <Button className="m-trade-ydr__btn" onClick={handleBuy}>
            Buy
          </Button>
        )}
        {modals.tradeIndex.method === 'sell' && !isNeedApprove && (
          <Button className="m-trade-ydr__btn" onClick={handleSell}>
            Sell
          </Button>
        )}
      </div>
    </Modal>
  );
});

export default TradeIndexModal;
