import React from 'react';

import metamask from '../../assets/img/auth/metamask.svg';
import walletconnect from '../../assets/img/auth/walletconnect.svg';

import './Auth.scss';

const Auth: React.FC = () => {
  return (
    <main className="container">
      <div className="auth">
        <div className="auth-block">
          <div className="auth-block__title">Welcome back</div>

          <div className="auth-block__inner">
            <div className="auth-method">
              <div className="auth-method__icon">
                <img src={metamask} alt="logo" width="107" height="111" />
              </div>
              <div className="auth-method__title">MetaMask</div>
              <div className="auth-method__descr">Connect to your MetaMask Wallet</div>
            </div>

            <div className="auth-method">
              <div className="auth-method__icon">
                <img src={walletconnect} alt="logo" width="138" height="85" />
              </div>
              <div className="auth-method__title">Wallet Connect</div>
              <div className="auth-method__descr">Connect to your Wallet Connect Wallet</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
