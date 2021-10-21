import React from 'react';

import { JsonAnimation } from '../../index';

// interface
import { IWheats } from '../../../types/components/simplifiedTypes';

import './Wheats.scss';

const Wheat: React.FC<IWheats> = ({ name, emoji, description, wheat, isAnim, animData }) => {
  const iff = (condition: boolean, then: string, otherwise: string) => {
    return condition ? then : otherwise;
  };
  return (
    <div className="wheat__item">
      <div className="wheat__title-wrapper">
        <p className="wheat__title">
          {emoji} {name}
        </p>
      </div>
      {description && <p className="wheat__subtitle">{description}</p>}
      <div className="wheat__weats-wrapper">
        {!isAnim ? (
          wheat.map((wheatImg) => (
            <div
              className={`wheat__weats-wrapper-${
                wheatImg.background === 'normal'
                  ? 'normal'
                  : iff(wheatImg.profit === false, 'bad', 'profit')
              }`}
            >
              {wheatImg.profit === true && <span className="wheat__text">+$</span>}
              <img className="wheat__img" width="30" height="38" src={wheatImg.wheat} alt=" " />
            </div>
          ))
        ) : (
          <div className="wheat__weats-wrapper-anim">
            <JsonAnimation animData={animData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wheat;
