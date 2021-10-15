import React from 'react';

import indexImg from '../../../assets/img/simplified/index.svg';
import tokenImg from '../../../assets/img/simplified/token.svg';
import waveImg from '../../../assets/img/simplified/Wave.svg';

import './Portfolio.scss';

const Portfolio: React.FC = () => {
  return (
    <section className="section portfolio">
      <h2 className="section__title text-outline">
        But how does YDragon apply this to my Crypto portfolio?
      </h2>
      <div className="portfolio__img-wrapper">
        <img className="portfolio__img" src={indexImg} alt="" />
        <img className="portfolio__img" src={waveImg} alt="" />
        <img className="portfolio__img" src={tokenImg} alt="" />
      </div>
      <div className="portfolio__subtitle-wrapper">
        <p className="portfolio__subtitle">
          As a YDragon index investor, you will be given another token that is equal to the exact
          value of that bundle as a whole. This 1 index token can now be used to monitor the
          performance of all the tokens within the index.
        </p>
      </div>
    </section>
  );
};

export default Portfolio;
