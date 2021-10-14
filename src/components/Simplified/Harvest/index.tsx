import React from 'react';

import './Harvest.scss';
import { Wheat } from '../components/index';

import WheatImg from '../../../assets/img/simplified/diversify/wheatNoProfit.svg';
import WheatBImg from '../../../assets/img/simplified/diversify/wheatB.svg';
import WheatRImg from '../../../assets/img/simplified/diversify/wheatR.svg';
import WheatPImg from '../../../assets/img/simplified/diversify/wheatP.svg';
import WheatGImg from '../../../assets/img/simplified/diversify/wheatG.svg';

interface IWheat {
  background: string;
  profit: boolean,
  wheat: string
}
interface IHarvest {
  name: string;
  emoji: string;
  wheats: IWheat[];
}

const Harvest: React.FC = () => {
  const subtitle = `At the end of the year when it’s time to harvest, if it’s been a bad year for wheat, John will face huge losses. David planted four other crops, which will result in David still making a good profit, despite his loss on the wheat.`;

  const harvests: Array<IHarvest> = [
    {
      name: 'John',
      emoji: '😭',
      wheats: [
        {
          background: 'none',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'none',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'none',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'none',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'none',
          profit: false,
          wheat: WheatImg
        },
      ]
    },
    {
      name: 'David',
      emoji: '😎',
      wheats: [
        {
          background: 'none',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'none',
          profit: true,
          wheat: WheatBImg
        },
        {
          background: 'none',
          profit: true,
          wheat: WheatRImg
        },
        {
          background: 'none',
          profit: true,
          wheat: WheatPImg
        },
        {
          background: 'none',
          profit: true,
          wheat: WheatGImg
        }
      ]
    }
  ]

  return (
    <section className="section harvest">
      <h2 className="section__title text-outline">what if it&apos;s a bad harvest?</h2>
      <div className="harvest__wrapper">
        {
          harvests.map((data: IHarvest) =>
          <Wheat name={data.name} emoji={data.emoji} wheat={data.wheats} />
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