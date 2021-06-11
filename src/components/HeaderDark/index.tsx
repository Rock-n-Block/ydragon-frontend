import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import logo from '../../assets/img/icons/logo.svg';
// import { useMst } from '../../store/store';
// import { Button } from '../index';

import './Header.scss';

const Header: React.FC = observer(() => {
  // const { user } = useMst();
  // const [isLoggedIn, setLogged] = useState(false);
  /* const handleLogOut = () => {
    user.disconnect();
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

          {/*  <nav className="header__nav">
            <ul className="header-nav">
              <li className="header-nav__item">
                <Link to="/" className="header-nav__link">Home</Link>
              </li>
              <li className="header-nav__item">
                <Link to="/" className="header-nav__link">Index Products</Link>
              </li>
              <li className="header-nav__item">
                <Link to="/" className="header-nav__link">Dashboard</Link>
              </li>
              <li className="header-nav__item">
                <Link to="/" className="header-nav__link">About</Link>
              </li>
            </ul>
          </nav>

          <div className="header__sign">
            <ul className="header-nav">
              <li className="header-nav__item">
                <Button
                  link="/"
                  linkClassName="header-nav__link"
                  type="text"
                  styledType="clear"
                  onClick={handleLogOut}
                >
                  Sign In
                </Button>
              </li>
              <li className="header-nav__item">
                <Button
                  link="/auth"
                  linkClassName="header-nav__btn"
                  styledType="nav"
                >
                  Sign Up
                </Button>
              </li>
            </ul>
          </div> */}
        </div>
      </div>
    </header>
  );
});

export default Header;
