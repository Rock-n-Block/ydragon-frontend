import React from 'react';

import './Basket.scss';
import basketImg from '../../../assets/img/simplified/basket.svg';

const Basket: React.FC = () => {
  return (
    <section className="section basket">
      <h2 className="section__title text-outline">What is an index</h2>
      <div className="basket__main-wrapper">
        <p className="basket__subtitle">Simply put, an index is a selection of high-performing assets, grouped into 1 basket</p>
          <img className="basket__img" width="532" height="200"src={basketImg} alt="" />
      </div>
    </section>
  )
}


export default Basket;