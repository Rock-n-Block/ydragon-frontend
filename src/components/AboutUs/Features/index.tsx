import React from 'react';

import iconHalfDan from '../../../assets/img/icons/icon-halfdan.svg';
import iconLeon from '../../../assets/img/icons/icon-leon.svg';
import iconOctal from '../../../assets/img/icons/icon-octal.svg';
import iconRadien from '../../../assets/img/icons/icon-raiden.svg';

import './Features.scss';

const Features: React.FC = () => {
  return (
    <section className="section features">
      <div className="features__title-wrapper">
        <h1 className="features__title text-outline">TEAM</h1>
      </div>
      <div className="features__items">
        <div className="features__row">
          <div className="feature">
            <div className="feature__img--wrapper">
              <img alt="#" className="feature__img" src={iconRadien} />
            </div>
            <div className="feature__info">
              <span className="feature__info--title">Raiden - CEO</span>
              <span className="feature__info--text">
                Core library contributor at a multi-billion dollar blockchain juggernaut, Big Data
                analyst for a secondary market platform, ex-founder and CEO of an ambitious tech
                startup and back-to-back high performance computing hackathon winner. Has a
                propensity for using specialized algorithms and data analysis to solve complex
                problems.
              </span>
            </div>
          </div>
          <div className="feature">
            <div className="feature__img--wrapper">
              <img alt="#" className="feature__img" src={iconOctal} />
            </div>
            <div className="feature__info">
              <span className="feature__info--title">OCTAL - COO</span>
              <span className="feature__info--text">
                Developed complex backend systems for one of the largest investment banks in the
                world, led multi-million dollar software projects to fruition in the electronic
                payments sector, previously CTO of a sentiment-driven investment platform project,
                in addition to having participated in doctoral graph theoretical work.
              </span>
            </div>
          </div>
        </div>
        <div className="features__row">
          <div className="feature">
            <div className="feature__img--wrapper">
              <img alt="#" className="feature__img" src={iconLeon} />
            </div>
            <div className="feature__info">
              <span className="feature__info--title">Leon - CMO</span>
              <span className="feature__info--text">
                Results driven IT project manager with experience delivering high value consulting
                projects focused on bespoke solution building. Skilled in building customer
                relationships up to C level and delivering multiple agile projects simultaneously.
                Currently delivering large scale solutions for an award winning cryptocurrency
                liquidity provider.
              </span>
            </div>
          </div>
          <div className="feature">
            <div className="feature__img--wrapper">
              <img alt="#" className="feature__img" src={iconHalfDan} />
            </div>
            <div className="feature__info">
              <span className="feature__info--title">HalfDan - CBDO</span>
              <span className="feature__info--text">
                Sales and marketing expert for top IT companies for almost 8 years. Adept in leading
                startup projects to success and developing their market all around the world. Former
                Co-Founder and COO of an early stage blockchain project where he managed a team.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
