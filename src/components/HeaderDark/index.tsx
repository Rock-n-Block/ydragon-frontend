import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import crossBlack from '../../assets/img/icons/icon-cross-black.svg';
import cross from '../../assets/img/icons/icon-cross.svg';
import iconMenuBlack from '../../assets/img/icons/icon-menu-black.svg';
import iconMenu from '../../assets/img/icons/icon-menu.svg';
import logo from '../../assets/img/icons/logo.svg';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { useWalletConnectorContext } from '../../services/walletConnect';
import { DARK, LIGHT, useMst } from '../../store/store';
import EventBanner from '../EventBanner';
import { Button, SelectNetwork, Switch, DropDown } from '../index';
import { aboutLinks, productLinks, mobileLinksData } from './linksData';
import HeaderMobileItem from './HeaderMobileItem';

import SocialLink from '../SocialLink/index';
import config from '../../config/index';

import './Header.scss';
import nextId from 'react-id-generator';

interface HeaderProps {
  collapsed: boolean;
  onCollapsedChange: (value: boolean) => void;
}

const Header: React.FC<HeaderProps> = observer(({ collapsed, onCollapsedChange }) => {
  const { SOCIAL_LINKS } = config;
  const [fixed, setFixed] = useState(true);
  const { theme, user } = useMst();
  const walletConnector = useWalletConnectorContext();
  const history = useHistory();

  const handleChangeTheme = () => {
    if (LIGHT === localStorage.theme) {
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
                <img
                  alt="burger menu"
                  src={collapsed ? iconMenu : cross}
                  width={collapsed ? '27' : '21'}
                  height={collapsed ? '14' : '21'}
                />
              ) : (
                <img
                  alt="burger menu"
                  src={collapsed ? iconMenuBlack : crossBlack}
                  width={collapsed ? '27' : '21'}
                  height={collapsed ? '14' : '21'}
                />
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
                {user.address && (
                  <Button
                    className="menu-nav__link logout menu-nav__link--button"
                    type="text"
                    styledType="clear"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </Button>
                )}
                {!user.address && (
                  <Button
                    linkClassName="menu-nav__btn menu-nav__link--button"
                    styledType="nav"
                    onClick={connectWallet}
                  >
                    Connect wallet
                  </Button>
                )}
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
                  <DropDown title="Products" links={productLinks} />
                </li>
                <li className="header-nav__item">
                  <DropDown title="About" links={aboutLinks} />
                </li>
                {localStorage.getItem('yd_token') && (
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
                {mobileLinksData.map((item) => (
                  <HeaderMobileItem
                    key={nextId()}
                    title={item.title}
                    links={item.links}
                    onCollapsedChange={onCollapsedChange}
                    titleLink={item.titleLink}
                  />
                ))}
              </ul>
            </nav>
            <div className="menu_social_links">
              <SocialLink
                icon={SOCIAL_LINKS.tgChat.iconDark}
                title="Chat"
                href={SOCIAL_LINKS.tgChat.url}
              />
              <SocialLink
                title="Channel"
                icon={SOCIAL_LINKS.tgChannel.iconDark}
                href={SOCIAL_LINKS.tgChat.url}
              />
              <SocialLink icon={SOCIAL_LINKS.twitter.iconDark} href={SOCIAL_LINKS.twitter.url} />
              <SocialLink icon={SOCIAL_LINKS.medium.iconDark} href={SOCIAL_LINKS.medium.url} />
            </div>
            <div className="menu_subitle">© 2021 YDragon</div>
          </nav>
        </div>
      </div>
    </div>
  );
});

export default Header;
