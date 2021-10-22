import React from 'react';

import { JsonAnimation } from '../../index';

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
          <div className="card__img">
            <JsonAnimation animData={img} />
          </div>
        </div>
        <p className="card__text">{description}</p>
      </div>
    </>
  );
};

export default Card;
