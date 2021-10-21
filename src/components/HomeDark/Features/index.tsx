import React from 'react';
import { observer } from 'mobx-react';

import { useMst } from '../../../store/store';
import { JsonAnimation } from '../../index';

import iconAnim1 from '../../../assets/json-anim/feature-1.json';
import iconAnim1L from '../../../assets/json-anim/feature-1-light.json';
import iconAnim2 from '../../../assets/json-anim/feature-2.json';
import iconAnim3 from '../../../assets/json-anim/feature-3.json';
import iconAnim4 from '../../../assets/json-anim/feature-4.json';

import './Features.scss';

const Features: React.FC = observer(() => {
  const { theme } = useMst();

  return (
    <section className="section">
      <h2 className="section__title text-outline">features</h2>
      <p className="section__sub-title">meet our key features</p>

      <div className="features">
        <div className="features-item">
          <div className="features-item__icon">
            <JsonAnimation
              animData={theme.value === 'light' ? iconAnim1L : iconAnim1}
              height="64px"
              width="64px"
            />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Cross-Chain</div>

            <div className="features-item__descr">
              The YDragon protocol allows you to invest in indexes from various blockchains.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <JsonAnimation animData={iconAnim4} height="64px" width="64px" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Yield Generation</div>

            <div className="features-item__descr">
              Lock your funds in one of our index tokens and stake it to automatically receive
              passive income.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <JsonAnimation animData={iconAnim2} height="64px" width="64px" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Risk Diversification</div>

            <div className="features-item__descr">
              Our indexes split the risk into the top performing and most promising tokens.
            </div>
          </div>
        </div>

        <div className="features-item">
          <div className="features-item__icon">
            <JsonAnimation animData={iconAnim3} height="64px" width="64px" />
          </div>
          <div className="features-item__content">
            <div className="features-item__title">Utility & Governance</div>

            <div className="features-item__descr">
              Stake your YDR tokens to receive passive income and have your say by voting on the
              future of YDragon indexes and strategies.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});

export default Features;
