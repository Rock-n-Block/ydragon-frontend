import React from 'react';

import './Harvest.scss';
import { Wheat } from '../components/index';
// data
import { harvestData } from '../components/data';
// interface
import { IWheats } from '../components/types';



const Harvest: React.FC = () => {
  const subtitle = `At the end of the year when it’s time to harvest, if it’s been a bad year for wheat, John will face huge losses. David planted four other crops, which will result in David still making a good profit, despite his loss on the wheat.`;

  return (
    <section className="section harvest">
      <h2 className="section__title text-outline">what if it&apos;s a bad harvest?</h2>
      <div className="harvest__wrapper">
        {
          harvestData.map((data: IWheats) =>
          <Wheat name={data.name} emoji={data.emoji} wheat={data.wheat} />
          )
        }
      </div>
      <div className="harvest__subtitle-wrapper">
        <span className="harvest__subtitle">{subtitle}</span>
        <div className="harvest__main-subtitle-wrapper">
          <span className="harvest__subtitle-main">Diversification creates <strong>Risk Reduction</strong>, which are both core benefits of investing in an index fund.</span>
        </div>
      </div>
    </section>
  )
}

export default Harvest;