import React from 'react';

// interfaces
import { ICard } from '../../../types/components/simplifiedTypes';

import './Card.scss';

const Card: React.FC<ICard> = ({ title, icon, img, description }) => {
  return (
    <>
      <div className="card__item" key={title}>
        <div className="card__title-wrapper">
          <p className="card__title">{title}</p>
          <img alt="" src={icon} />
        </div>
        <div className="card__img-wrapper">
          <img alt="" className="card__img" src={img} />
        </div>
        <p className="card__text">{description}</p>
      </div>
    </>
  );
};

export default Card;
