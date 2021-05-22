import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/img/icons/logo.svg';

import './Header.scss';

const Header: React.FC = () => {
  const [isLoggedIn, setLogged] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="header__inner">
          <div className="header__logo">
            <Link to="/">
              <img src={logo} alt="logo" width="64" height="58" />
            </Link>

            <div className="header__logo-text">YDRAGON</div>
          </div>

          <nav className="header__nav">
            {isLoggedIn ? (
              <ul className="header-nav">
                <li className="header-nav__item">
                  <Link to="/" className="header-nav__btn">
                    Buy YDR
                  </Link>
                </li>
                <li className="header-nav__item">
                  <Link to="/" className="header-nav__link">
                    Index
                  </Link>
                </li>
                <li className="header-nav__item">
                  <Link to="/" className="header-nav__link" onClick={() => setLogged(false)}>
                    Log Out
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="header-nav">
                <li className="header-nav__item">
                  <Link to="/" className="header-nav__link" onClick={() => setLogged(true)}>
                    Login
                  </Link>
                </li>
                <li className="header-nav__item">
                  <Link to="/auth" className="header-nav__btn">
                    Sign Up
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
