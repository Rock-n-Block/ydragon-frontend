import React from 'react';

import { JsonAnimation } from '../../index';
import waveAnim from '../../../assets/json-anim/simplified-wawe.json';
import indexAnim from '../../../assets/json-anim/simplified-egg-index.json';
import tokenAnim from '../../../assets/json-anim/simplified-egg-token.json';

import './Portfolio.scss';

const Portfolio: React.FC = () => {
  return (
    <section className="section portfolio">
      <h2 className="section__title text-outline">
        But how does YDragon apply this to my Crypto portfolio?
      </h2>
      <div className="portfolio__img-wrapper">
        <JsonAnimation animData={indexAnim} />
        <div className="portfolio__img-wave">
          <JsonAnimation animData={waveAnim} />
        </div>
        <JsonAnimation animData={tokenAnim} />
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
