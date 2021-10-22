import React from 'react';

import { JsonAnimation } from '../../index';

// interface
import { IWheats } from '../../../types/components/simplifiedTypes';

import './Wheats.scss';

const Wheat: React.FC<IWheats> = ({ name, emoji, description, isAnim, animData }) => {
  return (
    <div className="wheat__item">
      <div className="wheat__title-wrapper">
        <p className="wheat__title">
          {emoji} {name}
        </p>
      </div>
      {description && <p className="wheat__subtitle">{description}</p>}
      <div className="wheat__weats-wrapper">
        {isAnim && (
          <div className="wheat__weats-wrapper-anim">
            <JsonAnimation animData={animData} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Wheat;
