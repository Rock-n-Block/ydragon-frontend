import React from 'react';
import { Link } from 'react-router-dom';
import { NavHashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react-lite';

import logo from '../../assets/img/icons/logo.svg';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Whitepaper from '../../assets/pdf/YD_WP.pdf';
import { DARK, useMst } from '../../store/store';

import PoweredBy from './PoweredBy';
import SocialLink from '../SocialLink';
import config from '../../config';

import './Footer.scss';

const Footer: React.FC = observer(() => {
  const { theme } = useMst();
  const { SOCIAL_LINKS } = config;
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
                <SocialLink
                  href={SOCIAL_LINKS.tgChannel.url}
                  title="Channel"
                  icon={SOCIAL_LINKS.tgChannel.iconDark}
                />
                <SocialLink
                  href={SOCIAL_LINKS.tgChat.url}
                  title="Chat"
                  icon={SOCIAL_LINKS.tgChannel.iconDark}
                />
                <SocialLink href={SOCIAL_LINKS.twitter.url} icon={SOCIAL_LINKS.twitter.iconDark} />
                <SocialLink href={SOCIAL_LINKS.medium.url} icon={SOCIAL_LINKS.medium.iconDark} />
              </div>
              <div className="footer__socials-divider" />
              <div className="footer__socials-group">
                <SocialLink
                  href={SOCIAL_LINKS.coinMarketCap.url}
                  icon={
                    theme.value === DARK
                      ? SOCIAL_LINKS.coinMarketCap.iconDark
                      : SOCIAL_LINKS.coinMarketCap.iconLight
                  }
                />
                <SocialLink
                  href={SOCIAL_LINKS.coingecko.url}
                  icon={SOCIAL_LINKS.coingecko.iconDark}
                />
                <SocialLink href={SOCIAL_LINKS.nomics.url} icon={SOCIAL_LINKS.nomics.iconDark} />
              </div>
            </div>

            <div className="footer__copyright">?? 2021 YDRAGON</div>
          </div>

          <div className="footer__col">
            <div className="footer__links-title">Products</div>

            <div className="footer__links">
              <Link to="/indexes">Index Products</Link>
              <Link to="/staking">StakePad</Link>
              <Link to="/pbf">Private Blockchain Funds</Link>
              <a href="https://bridge.ydragon.io/" target="_blank" rel="noopener noreferrer">
                Bridge
              </a>
            </div>
          </div>
          <div className="footer__col">
            <div className="footer__links-title">About</div>

            <div className="footer__links">
              <NavHashLink to="/about-us#top">About Us</NavHashLink>
              <Link to="/simplified">YDragon simplified</Link>
              <NavHashLink to="/about-us#FAQ" smooth className="text-gray text-bold">
                FAQ
              </NavHashLink>
              <a href={Whitepaper} target="_blank" rel="noopener noreferrer">
                Whitepaper
              </a>
              <a href="mailto:info@ydragon.io" target="_blank" rel="noopener noreferrer">
                Contact us
              </a>
            </div>
          </div>
        </div>
        <PoweredBy />
      </div>
    </footer>
  );
});

export default Footer;
