import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import crossBlack from '../../assets/img/icons/icon-cross-black.svg';
import cross from '../../assets/img/icons/icon-cross.svg';
import iconMenuBlack from '../../assets/img/icons/icon-menu-black.svg';
import iconMenu from '../../assets/img/icons/icon-menu.svg';
import logo from '../../assets/img/icons/logo.svg';
import dis from '../../assets/img/socials/discord.svg';
import md from '../../assets/img/socials/medium.svg';
import tg from '../../assets/img/socials/telegram.svg';
import tw from '../../assets/img/socials/twitter.svg';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { DARK, LIGHT, useMst } from '../../store/store';
import EventBanner from '../EventBanner';
import { Button, SelectNetwork, Switch } from '../index';

import './Header.scss';

interface HeaderProps {
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = observer(({ collapsed, onCollapsedChange }) => {
  const [fixed, setFixed] = useState(true);
  const { theme, user } = useMst();
  const walletConnector = useWalletConnectorContext();
  const history = useHistory();

  const handleChangeTheme = () => {
    if (LIGHT === sessionStorage.getItem('theme')) {
      theme.setTheme(DARK);
    } else {
      theme.setTheme(LIGHT);
    }
  };

  const handleLogOut = () => {
    onCollapsedChange(true);
    walletConnector.disconnect();
  };

  const connectWallet = (): void => {
    onCollapsedChange(true);
    walletConnector.connect();
  };

  const redirectHandler = (path: string) => {
    onCollapsedChange(true);
    history.push(path);
  };

  useEffect(() => {
    if (!collapsed) {
      setTimeout(() => setFixed(true), 400);
    } else {
      setFixed(false);
    }
  }, [collapsed]);

  return (
    <div className={`header__wrapper  ${fixed ? 'fixed' : ''}`}>
      <EventBanner />
      <div className={`header ${collapsed ? 'collapse' : 'expand'}`}>
        <div className="container">
          <div className="header__inner">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={() => onCollapsedChange(!collapsed)}
              onClick={() => onCollapsedChange(!collapsed)}
              className="header__menu"
            >
              {DARK === theme.value ? (
                <img alt="#" src={collapsed ? iconMenu : cross} />
              ) : (
                <img alt="#" src={collapsed ? iconMenuBlack : crossBlack} />
              )}
            </div>
            {collapsed ? (
              <div className="header__logo">
                <Button styledType="clear" onClick={() => redirectHandler('/')}>
                  <img src={logo} alt="logo" width="40" height="36" />
                </Button>
                <div className="header__logo-text">YDRAGON</div>
              </div>
            ) : (
              <div className="menu__sign">
                <Switch checked={DARK === theme.value} onChange={handleChangeTheme} />
                <SelectNetwork />
                <ul className="menu-nav">
                  {user.address && (
                    <li className="menu-nav__item">
                      <Button
                        className="menu-nav__link"
                        type="text"
                        styledType="clear"
                        onClick={handleLogOut}
                      >
                        Log Out
                      </Button>
                    </li>
                  )}
                  {!user.address && (
                    <li className="menu-nav__item">
                      <Button
                        linkClassName="menu-nav__btn"
                        styledType="nav"
                        onClick={connectWallet}
                      >
                        Connect wallet
                      </Button>
                    </li>
                  )}
                </ul>
              </div>
            )}

            <nav className="header__nav">
              <ul className="header-nav">
                <li className="header-nav__item">
                  <Link to="/" className="header-nav__link">
                    Home
                  </Link>
                </li>
                <li className="header-nav__item">
                  <Link to="/indexes" className="header-nav__link">
                    Index Products
                  </Link>
                </li>
                {user.address && (
                  <li className="header-nav__item">
                    <Link to="/staking" className="header-nav__link">
                      Staking
                    </Link>
                  </li>
                )}
                <li className="header-nav__item">
                  <Link to="/about-us" className="header-nav__link">
                    About
                  </Link>
                </li>
                {sessionStorage.getItem('yd_token') && (
                  <li className="header-nav__item">
                    <Link to="/admin" className="header-nav__link">
                      Admin panel
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            <div className="header__sign">
              <Switch checked={DARK === theme.value} onChange={handleChangeTheme} />
              <SelectNetwork />
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
                    <Button
                      linkClassName="header-nav__btn"
                      styledType="nav"
                      onClick={connectWallet}
                    >
                      Connect wallet
                    </Button>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <nav className="menu">
            <nav className="menu__nav">
              <ul className="menu-nav">
                <li className="menu-nav__item">
                  <Button
                    styledType="clear"
                    onClick={() => redirectHandler('/')}
                    className="menu-nav__link"
                  >
                    Home
                  </Button>
                </li>
                <li className="menu-nav__item">
                  <Button
                    styledType="clear"
                    onClick={() => redirectHandler('/indexes')}
                    className="menu-nav__link"
                  >
                    Index Products
                  </Button>
                </li>
                {user.address && (
                  <li className="menu-nav__item">
                    <Button
                      styledType="clear"
                      onClick={() => redirectHandler('/staking')}
                      className="menu-nav__link"
                    >
                      Staking
                    </Button>
                  </li>
                )}
                <li className="menu-nav__item">
                  <Button
                    styledType="clear"
                    onClick={() => redirectHandler('/about-us')}
                    className="menu-nav__link"
                  >
                    About
                  </Button>
                </li>
                {sessionStorage.getItem('yd_token') && (
                  <li className="menu-nav__item">
                    <Button
                      styledType="clear"
                      onClick={() => redirectHandler('/admin')}
                      className="menu-nav__link"
                    >
                      Admin panel
                    </Button>
                  </li>
                )}
              </ul>
            </nav>
          </nav>
          <div className="footer__wrapper">
            <div className="footer__col">
              <div className="footer__links-title">Product</div>

              <div className="footer__links">
                <span className="isDisabled">
                  <a href="/">Whitepaper</a>
                </span>
                <span className="isDisabled">
                  <a href="/">Privacy Policy</a>
                </span>
                <span className="isDisabled">
                  <a href="/">Terms of Service</a>
                </span>
                <a href="mailto:info@ydragon.io" target="_blank" rel="noopener noreferrer">
                  Contact us
                </a>
              </div>
            </div>

            <div className="footer__col">
              <div className="footer__links-title">Engage</div>

              <div className="footer__links">
                <Link to="/about-us">About Us</Link>
                <span className="isDisabled">
                  <a href="/">Tutorial</a>
                </span>
                <span className="isDisabled">
                  <a href="/">FAQ</a>
                </span>
              </div>
            </div>

            <div className="footer__col">
              <div className="footer__links-title">DeFi</div>

              <div className="footer__links">
                <span className="isDisabled">
                  <a href="/">Index Products</a>
                </span>
                <span className="isDisabled">
                  <a href="/">Become Partner</a>
                </span>
              </div>
            </div>
            {!collapsed && (
              <div className="footer__socials">
                <a
                  href="https://t.me/ydrmain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item"
                >
                  <img src={tg} alt="logo" width="24" height="20" />
                </a>

                <a
                  href="https://twitter.com/ydragons_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item"
                >
                  <img src={tw} alt="logo" width="24" height="20" />
                </a>

                <a href="/" className="footer__socials-item">
                  <img src={md} alt="logo" width="24" height="20" />
                </a>

                <a href="/" className="footer__socials-item">
                  <img src={dis} alt="logo" width="24" height="20" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export default Header;
