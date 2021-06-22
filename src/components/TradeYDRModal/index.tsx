import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../assets/img/icons/logo.svg';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';
import { platformToken, TokenMiniNameTypes, tokensArray } from '../../utils/tokenMini';
import { Button, InputWithSelect, Modal } from '../index';

import './TradeYDRModal.scss';

const TradeYDRModal: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals } = useMst();
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(
    modals.tradeYDR.method === 'sell' ? 'YDR' : tokensArray[0].name,
  );
  const [secondCurrency, setSecondCurrency] = useState<TokenMiniNameTypes>(
    modals.tradeYDR.method === 'sell' ? tokensArray[0].name : 'YDR',
  );
  const [payInput, setPayInput] = useState<string>('0');
  const [viewOnlyInputValue, setViewOnlyInputValue] = useState<string>('0.0');
  const [balance, setBalance] = useState<number>(0);
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const handleClose = (): void => {
    modals.tradeYDR.close();
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

  const getBuyCource = useCallback(
    (e: any) => {
      walletConnector.metamaskService
        .getBuyYDRCource(firstCurrency, e.target.value)
        .then((data: any) => {
          console.log(`Cource of ${firstCurrency} to YDR `, data[data.length - 1]);
          setViewOnlyInputValue(
            new BigNumber(data[data.length - 1]).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: any) => {
          const { response } = err;
          console.log('getCource error', response);
        });
    },
    [firstCurrency, walletConnector.metamaskService],
  );

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
    if (modals.tradeYDR.method === 'sell') {
      setSecondCurrency(value);
    } else {
      setFirstCurrency(value);
      setPayInput('');
      setViewOnlyInputValue('0.0');
    }
  };
  const handleApprove = (): void => {
    walletConnector.metamaskService
      .approve(firstCurrency, 'Router')
      .then((data: any) => {
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
        console.log(`buy of ${secondCurrency} for ${firstCurrency} success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('buy error', response);
      });
  };
  const handleSell = (): void => {
    walletConnector.metamaskService
      .sellYDRToken(payInput, firstCurrency)
      .then((data: any) => {
        console.log(`sell of ${firstCurrency} for ${secondCurrency} success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('sell error', response);
      });
  };
  useEffect(() => {
    setFirstCurrency(modals.tradeYDR.method === 'sell' ? 'YDR' : tokensArray[0].name);
    setSecondCurrency(modals.tradeYDR.method !== 'sell' ? 'YDR' : tokensArray[0].name);
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
              tokens={tokensArray}
              onSelectChange={handleSelectChange}
              onChange={(event) => setPayInput(event.target.value)}
              type="number"
              placeholder="0.0"
              onBlur={getBuyCource}
            />
          ) : (
            <InputWithSelect
              value={payInput}
              onChange={(event) => setPayInput(event.target.value)}
              tokens={platformToken}
              type="number"
              placeholder="0.0"
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
              tokens={tokensArray}
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
