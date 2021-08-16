import React from 'react';
import { observer } from 'mobx-react-lite';

import backgroundImg from '../../../assets/img/connect-wallet/background-img.svg';
import metamaskLogo from '../../../assets/img/connect-wallet/metamask.svg';
import walletconnectLogo from '../../../assets/img/connect-wallet/walletconnect.svg';
import { useMst } from '../../../store/store';
import { Modal } from '../index';

import './ConnectWalletModal.scss';

const ConnectWalletModal: React.FC = observer(() => {
  const { modals } = useMst();

  return (
    <Modal
      isVisible={modals.connectWallet.isOpen}
      className="connect-wallet-box"
      handleCancel={modals.connectWallet.close}
    >
      <div className="background-image-container">
        <img src={backgroundImg} alt="" />
        <div className="background-image-container__text">Welcome back</div>
      </div>

      <div className="wallets-container">
        <div className="wallets-container__wallet">
          <div className="wallets-container__wallet__img-container">
            <img src={metamaskLogo} alt="Metamask" className="wallets-container__wallet__logo" />
          </div>
          <div className="wallets-container__wallet__title">Metamask</div>
          <div className="wallets-container__wallet__description">
            Connect to your MetaMask Wallet
          </div>
        </div>

        <div className="wallets-container__wallet">
          <div className="wallets-container__wallet__img-container">
            <img
              src={walletconnectLogo}
              alt="Wallet connect"
              className="wallets-container__wallet__logo"
            />
          </div>
          <div className="wallets-container__wallet__title">Wallet Connect</div>
          <div className="wallets-container__wallet__description">
            Connect to your Wallet Connect Wallet
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default ConnectWalletModal;
