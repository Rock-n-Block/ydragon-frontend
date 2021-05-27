import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/img/icons/logo.svg';

import './Header.scss';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../store/store';
import { Button } from '../index';

const Header: React.FC = observer(() => {
  const { user } = useMst();
  // const [isLoggedIn, setLogged] = useState(false);
  const handleLogOut = () => {
    user.disconnect();
  };
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
            {user.address ? (
              <ul className="header-nav">
                <li className="header-nav__item">
                  <Link to="/ydrtoken" className="header-nav__btn">
                    Buy YDR
                  </Link>
                </li>
                <li className="header-nav__item">
                  <Link to="/index" className="header-nav__link">
                    Index
                  </Link>
                </li>
                <li className="header-nav__item">
                  <Button className="header-nav__link" onClick={handleLogOut}>
                    Log Out
                  </Button>
                </li>
              </ul>
            ) : (
              <ul className="header-nav">
                <li className="header-nav__item">
                  <Link to="/auth" className="header-nav__btn">
                    Connect wallet
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
});

export default Header;
