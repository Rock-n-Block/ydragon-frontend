import React from 'react';

import './diversify.scss';
import { Wheat } from '../components/index';
// data
import { diversifysData } from '../components/data';
// interface
import { IWheats } from '../components/types';


const Diversify: React.FC = () => {

  return (
    <section className="section diversify">
      <h2 className="section__title text-outline">Why Diversify?</h2>
      <div className="diversify__container">
        {
          diversifysData.map((data: IWheats) => 
            <Wheat name={data.name} emoji={data.emoji} description={data.description} wheat={data.wheat} />
          )
        }
      </div>
    </section>
  )
}

export default Diversify;