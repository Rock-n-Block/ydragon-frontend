import React from 'react';
import { Modal } from '../index';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store/store';
import Logo from '../../assets/img/icons/logo.svg';
import './TradeYDRModal.scss';

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
          <img src={Logo} alt="logo" />
        </div>
        <h3 className="m-trade-ydr__header">
          I want to {modals.tradeYDR.method}
          <span> ydr token</span>
        </h3>
      </div>
    </Modal>
  );
});

export default TradeYDRModal;
