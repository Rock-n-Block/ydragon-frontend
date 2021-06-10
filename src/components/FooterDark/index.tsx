import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/img/icons/logo.svg';
import dis from '../../assets/img/socials/discord.svg';
import md from '../../assets/img/socials/medium.svg';
import tg from '../../assets/img/socials/telegram.svg';
import tw from '../../assets/img/socials/twitter.svg';

import './Footer.scss';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__col">
            <div className="footer__logo">
              <Link to="/">
                <img src={logo} alt="logo" width="40" height="36" />
              </Link>
              <div className="footer__logo-text">YDRAGON</div>
            </div>

            <div className="footer__descr">
              YDragon is a cross-chain index ecosystem with yield bearing collateral, providing a
              true interoperable cross-asset experience.
            </div>

            <div className="footer__socials">
              <a href="/" className="footer__socials-item">
                <img src={tg} alt="logo" width="16" height="16" />
              </a>

              <a href="/" className="footer__socials-item">
                <img src={tw} alt="logo" width="16" height="16" />
              </a>

              <a href="/" className="footer__socials-item">
                <img src={md} alt="logo" width="16" height="16" />
              </a>

              <a href="/" className="footer__socials-item">
                <img src={dis} alt="logo" width="16" height="16" />
              </a>
            </div>

            <div className="footer__copyright">© 2021 YDRAGON</div>
          </div>

          <div className="footer__col">
            <div className="footer__links-title">Product</div>

            <div className="footer__links">
              <a href="/">Whitepaper</a>
              <a href="/">Privacy Policy</a>
              <a href="/">Terms of Service</a>
              <a href="/">Contact us</a>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__links-title">Engage</div>

            <div className="footer__links">
              <a href="/">About Us</a>
              <a href="/">Tutorial</a>
              <a href="/">FAQ</a>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__links-title">DeFi</div>

            <div className="footer__links">
              <a href="/">Index Products</a>
              <a href="/">Become Partner</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
