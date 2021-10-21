import React from 'react';

// interface
import { IWheats } from '../../../types/components/simplifiedTypes';
// data
import { diversifysData } from '../data';
import { Wheat } from '../index';

import './diversify.scss';

const Diversify: React.FC = () => {
  return (
    <section className="section diversify">
      <h2 className="section__title text-outline">Why Diversify?</h2>
      <div className="diversify__container">
        {diversifysData.map((data: IWheats) => (
          <Wheat
            name={data.name}
            emoji={data.emoji}
            description={data.description}
            wheat={data.wheat}
            isAnim={data.isAnim}
            animData={data.animData}
          />
        ))}
      </div>
    </section>
  );
};

export default Diversify;
