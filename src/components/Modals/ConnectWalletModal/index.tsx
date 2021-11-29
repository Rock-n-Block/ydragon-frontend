import React from 'react';
import { observer } from 'mobx-react-lite';

import backgroundImg from '../../../assets/img/connect-wallet/background-img.svg';
import metamaskLogo from '../../../assets/img/connect-wallet/metamask.svg';
import walletconnectLogo from '../../../assets/img/connect-wallet/walletconnect.svg';
import dAppBrowserLogo from '../../../assets/img/connect-wallet/dAppBrowser.svg';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { WALLET_TYPE } from '../../../services/web3';
import { useMst } from '../../../store/store';
import { Modal } from '../index';

import './ConnectWalletModal.scss';
import { chainsEnum } from '../../../types';

const ConnectWalletModal: React.FC = observer(() => {
  const { modals, networks } = useMst();
  const { connect } = useWalletConnectorContext();

  const [walletconnectClicked, setWalletconnectClicked] = React.useState(false);

  const onConnect = (walletType: WALLET_TYPE): void => {
    if (walletType === WALLET_TYPE.WALLETCONNECT) {
      setWalletconnectClicked(true);
    }
    connect(networks.currentNetwork as chainsEnum, walletType);
    modals.connectWallet.close();
  };

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
        <button
          type="button"
          className="wallets-container__wallet"
          onClick={() => onConnect(WALLET_TYPE.METAMASK)}
        >
          <div className="wallets-container__wallet__img-container">
            <img src={metamaskLogo} alt="Metamask" className="wallets-container__wallet__logo" />
          </div>
          <div className="wallets-container__wallet__text">
            <div className="wallets-container__wallet__title">Metamask</div>
            <div className="wallets-container__wallet__description">
              Connect to your MetaMask Wallet
            </div>
          </div>
        </button>

        <button
          type="button"
          className="wallets-container__wallet"
          onClick={() => onConnect(WALLET_TYPE.WALLETCONNECT)}
        >
          <div className="wallets-container__wallet__img-container">
            <img
              src={walletconnectLogo}
              alt="Wallet connect"
              className="wallets-container__wallet__logo"
            />
          </div>
          <div className="wallets-container__wallet__text">
            <div className="wallets-container__wallet__title">Wallet Connect</div>
            <div className="wallets-container__wallet__description">
              {!walletconnectClicked
                ? 'Connect to your Wallet Connect Wallet'
                : 'Sign message in your wallet (it may take a while to appear)'}
            </div>
          </div>
        </button>
        <button
          type="button"
          className="wallets-container__wallet"
          onClick={() => onConnect(WALLET_TYPE.METAMASK)}
        >
          <div className="wallets-container__wallet__img-container">
            <img
              src={dAppBrowserLogo}
              alt="dApp browser"
              className="wallets-container__wallet__logo"
            />
          </div>
          <div className="wallets-container__wallet__text">
            <div className="wallets-container__wallet__title">TrustWallet</div>
            <div className="wallets-container__wallet__description">
              Connect to your TrustWallet
            </div>
          </div>
        </button>
      </div>
    </Modal>
  );
});

export default ConnectWalletModal;
