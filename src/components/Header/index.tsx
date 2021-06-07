import React from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import logo from '../../assets/img/icons/logo.svg';
import { useMst } from '../../store/store';
import { Button } from '../index';

import './Header.scss';

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
                  <Button
                    link="/ydrtoken"
                    linkClassName="header-nav__btn"
                    styledType="nav"
                    background="gray"
                  >
                    Buy YDR
                  </Button>
                </li>
                {localStorage.yd_token ? (
                  <li className="header-nav__item">
                    <Button
                      link="/admin"
                      linkClassName="header-nav__link"
                      type="text"
                      styledType="clear"
                    >
                      Admin Panel
                    </Button>
                  </li>
                ) : (
                  <></>
                )}
                <li className="header-nav__item ">
                  <Button
                    link="/indexes"
                    linkClassName="header-nav__link"
                    type="text"
                    styledType="clear"
                  >
                    Indexes
                  </Button>
                </li>
                <li className="header-nav__item">
                  <Button
                    link="/index/1"
                    linkClassName="header-nav__link"
                    type="text"
                    styledType="clear"
                    onClick={handleLogOut}
                  >
                    Log Out
                  </Button>
                </li>
              </ul>
            ) : (
              <ul className="header-nav">
                <li className="header-nav__item">
                  <Button
                    link="/auth"
                    linkClassName="header-nav__btn"
                    styledType="nav"
                    background="gray"
                  >
                    Connect wallet
                  </Button>
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
