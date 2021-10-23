import React from 'react';

// interface
import { ICard } from '../../../types/components/simplifiedTypes';
// data
import { purposeCardsData } from '../data';
import { Card } from '../index';

import './Purpose.scss';

const Purpose: React.FC = () => {
  return (
    <section className="section purpose">
      <h2 className="section__title text-outline">PURPOSE</h2>
      <div className="purpose__purpose-wrapper">
        {purposeCardsData.map((item: ICard) => (
          <Card title={item.title} icon={item.icon} img={item.img} description={item.description} />
        ))}
      </div>
    </section>
  );
};

export default Purpose;
