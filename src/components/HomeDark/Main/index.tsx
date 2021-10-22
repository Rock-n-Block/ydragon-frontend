import React from 'react';

import HomeImg from '../../../assets/img/start.svg';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Whitepaper from '../../../assets/pdf/YD_WP.pdf';
import { Button } from '../../index';
import SocialLink from '../../SocialLink';
import { socialLinks } from '../../../config';

import './Main.scss';

const Main: React.FC = () => {
  return (
    <section className="section home">
      <div className="home__title-wrapper">
        <span className="home__title text-gradient">DEFI</span>
        <span className="home__title text-outline">MADE SIMPLE</span>
      </div>
      <img src={HomeImg} alt="" className="home__img" />

      <p className="home__descr">
        A cross-chain platform that delivers multiple sources of income. Carefully crafted by
        YDragon.
      </p>

      <div className="home__btns-row">
        <Button linkClassName="home__btn" link="/ydrtoken">
          Buy YDR
        </Button>
        <Button
          link={Whitepaper}
          target="_blank"
          rel="noopener noreferrer"
          linkClassName="home__btn"
          styledType="outline"
        >
          Whitepaper
        </Button>
      </div>
      <div className="home_social-links">
        <SocialLink
          href={socialLinks.tgChannel.url}
          title="Channel"
          icon={socialLinks.tgChannel.iconDark}
        />
        <SocialLink href={socialLinks.tgChat.url} title="Chat" icon={socialLinks.tgChat.iconDark} />
        <SocialLink href={socialLinks.twitter.url} icon={socialLinks.twitter.iconDark} />
        <SocialLink href={socialLinks.medium.url} icon={socialLinks.medium.iconDark} />
      </div>

      {/* <div className="home__currently-price">
        &quot;The YDragon project has currently <span>XXXX$</span> diversified among indexes&quot;.
        (TVL)
      </div> */}
    </section>
  );
};

export default Main;
