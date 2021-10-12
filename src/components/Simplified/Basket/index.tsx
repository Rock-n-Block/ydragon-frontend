import React from 'react';

import './Basket.scss';
import basketImg from '../../../assets/img/simplified/basket.svg';

const Basket: React.FC = () => {
  return (
    <section className="section basket">
      <h2 className="section__title text-outline">What is an index</h2>
      <div className="basket__main-wrapper">
        <span className="basket__subtitle">Simply put, an index is a selection of high-performing assets, grouped into 1 basket</span>
        <div className="basket__img-wrapper">
          <img className="basket__img" src={basketImg} alt="" />
        </div>
      </div>
    </section>
  )
}


export default Basket;