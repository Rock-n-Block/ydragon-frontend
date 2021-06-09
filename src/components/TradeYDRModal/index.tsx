import React from 'react';
import { observer } from 'mobx-react-lite';

import YDRLogo from '../../assets/img/icons/logo.svg';
import { useMst } from '../../store/store';
import { Button, InputWithSelect, Modal } from '../index';

import './TradeYDRModal.scss';
import { platformToken, tokensArray } from '../../utils/tokenMini';

const TradeYDRModal: React.FC = observer(() => {
  const { modals } = useMst();
  const handleClose = (): void => {
    modals.tradeYDR.close();
  };
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
            <span className="m-trade-ydr__label">Balance: 1.313 BNB</span>
          </div>
          {modals.tradeYDR.method === 'buy' ? (
            <InputWithSelect value="0.0" tokens={tokensArray} />
          ) : (
            <InputWithSelect value="0.0" tokens={platformToken} />
          )}
        </div>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">Your Receive</span>
          </div>

          {modals.tradeYDR.method === 'sell' ? (
            <InputWithSelect value="0.0" tokens={tokensArray} />
          ) : (
            <InputWithSelect value="0.0" tokens={platformToken} />
          )}
        </div>
        <p className="m-trade-ydr__label m-trade-ydr__fee">Service Fee 0.441 BNB</p>
        {modals.tradeYDR.method === 'sell' && <Button className="m-trade-ydr__btn">Approve</Button>}
        {modals.tradeYDR.method === 'buy' && <Button className="m-trade-ydr__btn">Buy</Button>}
        {modals.tradeYDR.method === 'sell' && <Button className="m-trade-ydr__btn">Sell</Button>}
      </div>
    </Modal>
  );
});

export default TradeYDRModal;
