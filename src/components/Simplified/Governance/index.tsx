import React from 'react';

import { JsonAnimation } from '../../index';
import sliderAnim from '../../../assets/json-anim/simplified-slider.json';

import './Governance.scss';

const Governance: React.FC = () => {
  return (
    <section className="section governance">
      <h2 className="section__title text-outline">
        What other positives do YDragon indexes include?
      </h2>
      <div className="governance__wrapper">
        <div className="governance__slider-wrapper">
          <JsonAnimation animData={sliderAnim} />
        </div>
        <div className="governance__subtitle-wrapper">
          <h3 className="governance__title">GOVERNANCE</h3>
          {/* <div className="governance__line" /> */}
          <div className="governance__text-wrapper">
            <ul className="governance__list-paragraphs">
              <li className="governance__paragraphs">
                <p className="governance__text">
                  As part of every index, which include high performing cryptocurrencies, YDragon
                  will also include its own native token,{' '}
                  <span className="governance__text-color">YDR</span>
                </p>
              </li>
              <li className="governance__paragraphs">
                <p className="governance__text">
                  YDR will not only be an ever-present asset, but will also act as a{' '}
                  <span className="governance__text-color">governance token</span>
                </p>
              </li>
              <li className="governance__paragraphs">
                <p className="governance__text">
                  Governance tokens allow holders to help shape the future of the index fund as a
                  whole, by voting on things like future indexes and the assets within them.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Governance;
