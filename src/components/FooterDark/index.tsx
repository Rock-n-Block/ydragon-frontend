import React from 'react';
import { Link } from 'react-router-dom';

import logo from '../../assets/img/icons/logo.svg';
// import dis from '../../assets/img/socials/discord.svg';
// import md from '../../assets/img/socials/medium.svg';
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
              <a
                href="https://t.me/ydrmain/"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__socials-item"
              >
                <img src={tg} alt="logo" width="16" height="16" />
              </a>

              <a
                href="https://twitter.com/ydragons_"
                target="_blank"
                rel="noopener noreferrer"
                className="footer__socials-item"
              >
                <img src={tw} alt="logo" width="16" height="16" />
              </a>

              {/* <a href="/" className="footer__socials-item">
                <img src={md} alt="logo" width="16" height="16" />
              </a> */}
              {/*
              <a href="/" className="footer__socials-item">
                <img src={dis} alt="logo" width="16" height="16" />
              </a> */}
            </div>

            <div className="footer__copyright">© 2021 YDRAGON</div>
          </div>

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
              <span className="isDisabled">
                <a href="/">Contact us</a>
              </span>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__links-title">Engage</div>

            <div className="footer__links">
              <span className="isDisabled">
                <a href="/">About Us</a>
              </span>
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
        </div>
      </div>
    </footer>
  );
};

export default Footer;