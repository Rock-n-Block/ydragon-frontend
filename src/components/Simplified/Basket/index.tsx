import React from 'react';

import { JsonAnimation } from '../../index';
import basketAnim from '../../../assets/json-anim/simplified-basket.json';

import './Basket.scss';

const Basket: React.FC = () => {
  return (
    <section className="section basket">
      <h2 className="section__title text-outline">What is an index</h2>
      <div className="basket__main-wrapper">
        <p className="basket__subtitle">
          Simply put, an index is a selection of high-performing assets, grouped into 1 basket
        </p>
        <div className="basket__img">
          <JsonAnimation animData={basketAnim} width="532px" height="200px" />
        </div>
      </div>
    </section>
  );
};

export default Basket;
