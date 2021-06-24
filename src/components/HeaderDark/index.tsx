import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import logo from '../../assets/img/icons/logo.svg';
// import { useWalletConnectorContext } from '../../services/walletConnect';
// import { useMst } from '../../store/store';
// import { Button } from '../index';

import './Header.scss';

const Header: React.FC = observer(() => {
  /* const { user } = useMst();
  const walletConnector = useWalletConnectorContext();

  const handleLogOut = () => {
    walletConnector.disconnect();
  };

  const connectWallet = (): void => {
    walletConnector.connect();
  }; */
  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <div className="header__logo">
            <Link to="/">
              <img src={logo} alt="logo" width="40" height="36" />
            </Link>
            <div className="header__logo-text">YDRAGON</div>
          </div>

          <nav className="header__nav">
            <ul className="header-nav">
              <li className="header-nav__item">
                <Link to="/" className="header-nav__link">
                  Home
                </Link>
              </li>
              {/* <li className="header-nav__item">
                <Link to="/indexes" className="header-nav__link">
                  Index Products
                </Link>
              </li>
              <li className="header-nav__item">
                <Link to="/staking" className="header-nav__link">
                  Staking
                </Link>
              </li> */}
              <li className="header-nav__item">
                <Link to="/about-us" className="header-nav__link">
                  About
                </Link>
              </li>
              {localStorage.yd_token && (
                <li className="header-nav__item">
                  <Link to="/admin" className="header-nav__link">
                    Admin panel
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          {/* <div className="header__sign">
            <ul className="header-nav">
              {user.address && (
                <li className="header-nav__item">
                  <Button
                    className="header-nav__link"
                    type="text"
                    styledType="clear"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </Button>
                </li>
              )}
              {!user.address && (
                <li className="header-nav__item">
                  <Button linkClassName="header-nav__btn" styledType="nav" onClick={connectWallet}>
                    Connect wallet
                  </Button>
                </li>
              )}
            </ul>
          </div> */}
        </div>
      </div>
    </header>
  );
});

export default Header;
