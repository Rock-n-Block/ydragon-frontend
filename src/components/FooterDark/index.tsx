import React from 'react';
import { Link } from 'react-router-dom';
// import { NavHashLink } from 'react-router-hash-link';
import PoweredBy from './PoweredBy';

import logo from '../../assets/img/icons/logo.svg';
// import dis from '../../assets/img/socials/discord.svg';
import md from '../../assets/img/socials/medium.svg';
import tg from '../../assets/img/socials/telegram.svg';
import tw from '../../assets/img/socials/twitter.svg';
import coingecko from '../../assets/img/socials/coingecko.svg';
import coinmarketcapD from '../../assets/img/socials/coinmarketcap.svg';
import coinmarketcapL from '../../assets/img/socials/coinmarketcap-light.svg';
import nomics from '../../assets/img/socials/nomics.png';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// import Whitepaper from '../../assets/pdf/YD WP.pdf';

import './Footer.scss';
import { DARK, useMst } from '../../store/store';
import { observer } from 'mobx-react-lite';

const Footer: React.FC = observer(() => {
  const { theme } = useMst();
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
              <div className="footer__socials-group">
                <a
                  href="https://t.me/ydrmain/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item footer__socials-tg"
                >
                  <img src={tg} alt="telegram channel" width="16" height="16" />
                  <span>Channel</span>
                </a>

                <a
                  href="https://t.me/ydragonchat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item footer__socials-tg"
                >
                  <img src={tg} alt="telegram chat" width="16" height="16" />
                  <span>Chat</span>
                </a>
                <a
                  href="https://twitter.com/ydragons_"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item"
                >
                  <img src={tw} alt="twitter" width="16" height="16" />
                </a>
                <a
                  href="https://medium.com/ydragon-io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item"
                >
                  <img src={md} alt="medium" width="16" height="16" />
                </a>
              </div>
              <div className="footer__socials-divider" />
              <div className="footer__socials-group">
                <a
                  href="https://coinmarketcap.com/currencies/ydragon/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item"
                >
                  <img
                    src={theme.value === DARK ? coinmarketcapD : coinmarketcapL}
                    alt="coinmarketcap"
                    width="16"
                    height="16"
                  />
                </a>
                <a
                  href="https://www.coingecko.com/en/coins/ydragon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item"
                >
                  <img src={coingecko} alt="coingecko" width="16" height="16" />
                </a>
                <a
                  href="https://nomics.com/assets/ydr-ydragon"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer__socials-item"
                >
                  <img src={nomics} alt="nomics" width="16" height="16" />
                </a>
              </div>
              {/*
              <a href="/" className="footer__socials-item">
                <img src={dis} alt="logo" width="16" height="16" />
              </a> */}
            </div>

            <div className="footer__copyright">© 2021 YDRAGON</div>
          </div>

          {/* <div className="footer__col">
            <div className="footer__links-title">Product</div>

            <div className="footer__links">
              <a href={Whitepaper} target="_blank" rel="noopener noreferrer">
                Whitepaper
              </a>
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

              <NavHashLink to="/about-us#FAQ" smooth className="text-gray text-bold">
                FAQ
              </NavHashLink>
              <span className="isDisabled">
                <a href="/">Tutorial</a>
              </span>
              <span className="isDisabled"></span>
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
          </div> */}
        </div>
        <PoweredBy />
      </div>
    </footer>
  );
});

export default Footer;
