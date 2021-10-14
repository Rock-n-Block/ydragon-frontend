import React from 'react';

import './Purpose.scss';
import { Card } from '../components';
// data
import { cardData } from '../components/data';
// interface 
import { ICard } from '../components/types';
   

const Purpose: React.FC = () => {

  return (
    <section className="section purpose">
      <h2 className="section__title text-outline">PURPOSE</h2>
      <div className="purpose__purpose-wrapper">
        {
          cardData.map((item: ICard) => 
            <Card title={item.title} icon={item.icon} img={item.img} description={item.description} />
            )
        }
      </div>
    </section>
  )
}

export default Purpose;