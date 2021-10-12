import React from 'react';

import { Button } from '../../index';

import './About.scss';


import CoinsImg from '../../../assets/img/simplified/Coins.svg';
import ClickImg from '../../../assets/img/simplified/click.svg';


const About: React.FC = () => {
  return (
    <section className="section about">
      <div className="about__title-wrapper">
        <h2 className="about__title">WHY YDRAGON?</h2>
        <div className="about__line" />
        <span className="about__subtitle">We create opportunities for the community to invest in a number of coins in a simple way, and without wasting endless hours researching the best projects</span>
        <Button className="about__btn" linkClassName="home__btn" link="/ydrtoken">Invest Now</Button>
      </div>
      <div className="about__img-wrapper">
      <img src={CoinsImg} alt='' className="about__img"/>
      <img src={ClickImg} alt='' className="about__img-click"/>
      </div>
    </section>
  )
}

export default About;