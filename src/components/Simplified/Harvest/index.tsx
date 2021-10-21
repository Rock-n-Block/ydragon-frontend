import React from 'react';

// interface
import { IWheats } from '../../../types/components/simplifiedTypes';
// data
import { harvestData } from '../data';
import { Wheat } from '../index';

import './Harvest.scss';

const Harvest: React.FC = () => {
  const subtitle = `At the end of the year when it’s time to harvest, if it’s been a bad year for wheat, John will face huge losses. David planted four other crops, which will result in David still making a good profit, despite his loss on the wheat.`;

  return (
    <section className="section harvest">
      <h2 className="section__title text-outline">what if it&apos;s a bad harvest?</h2>
      <div className="harvest__wrapper">
        {harvestData.map((data: IWheats) => (
          <Wheat
            animData={data.animData}
            isAnim={data.isAnim}
            name={data.name}
            emoji={data.emoji}
            wheat={data.wheat}
          />
        ))}
      </div>
      <div className="harvest__subtitle-wrapper">
        <p className="harvest__subtitle">{subtitle}</p>
        <div className="harvest__main-subtitle-wrapper">
          <p className="harvest__subtitle-main">
            Diversification creates <strong>Risk Reduction</strong>, which are both core benefits of
            investing in an index fund.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Harvest;
