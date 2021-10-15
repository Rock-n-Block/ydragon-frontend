import React from 'react';

import ClickImg from '../../../assets/img/simplified/click.svg';
// import Coins2Img from '../../../assets/img/simplified/Click2.svg';
import CoinsImg from '../../../assets/img/simplified/Coins.svg';
import { Button } from '../../index';

import './About.scss';

const About: React.FC = () => {
  return (
    <section className="section about">
      <div className="about__title-wrapper">
        <h2 className="about__title">WHY YDRAGON?</h2>
        <p className="about__subtitle">
          We create opportunities for the community to invest in a number of coins in a simple way,
          and without wasting endless hours researching the best projects
        </p>
        <Button className="about__btn" linkClassName="home__btn" link="/ydrtoken">
          Invest Now
        </Button>
      </div>
      <div className="about__img-wrapper">
        <img src={CoinsImg} width="398" height="380" alt="" className="about__img" />
        <img src={ClickImg} width="159" height="254" alt="" className="about__img-click" />
      </div>
    </section>
  );
};

export default About;
