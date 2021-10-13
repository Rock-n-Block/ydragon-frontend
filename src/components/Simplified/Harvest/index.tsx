import React from 'react';

import './Harvest.scss';
import { DARK, useMst } from '../../../store/store';

import WheatImg from '../../../assets/img/simplified/diversify/wheatNoProfit.svg';
import WheatBImg from '../../../assets/img/simplified/diversify/wheatB.svg';
import WheatRImg from '../../../assets/img/simplified/diversify/wheatR.svg';
import WheatPImg from '../../../assets/img/simplified/diversify/wheatP.svg';
import WheatGImg from '../../../assets/img/simplified/diversify/wheatG.svg';

interface IWheat {
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
  const { theme } = useMst();
  const harvests: Array<IHarvest> = [
    {
      name: 'John',
      emoji: '😭',
      wheats: [
        {
          profit: false,
          wheat: WheatImg
        },
        {
          profit: false,
          wheat: WheatImg
        },
        {
          profit: false,
          wheat: WheatImg
        },
        {
          profit: false,
          wheat: WheatImg
        },
        {
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
          profit: false,
          wheat: WheatImg
        },
        {
          profit: true,
          wheat: WheatBImg
        },
        {
          profit: true,
          wheat: WheatRImg
        },
        {
          profit: true,
          wheat: WheatPImg
        },
        {
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
          harvests.map((h: IHarvest) =>
            <div className="harvest__item">
              <div className={`harvest__title-wrapper-${ DARK === theme.value ? 'Black' : 'White'}`}>
                <span className="harvest__title">{h.emoji} {h.name}</span>
              </div>
              <div className="harvest__weats-wrapper">
                {
                  h.wheats.map(w  => 
                        <div className={w.profit === false ? 'harvest__weat-container' : 'harvest__weat-container-profit'}>
                          {w.profit === true ? <span className="harvest__text">+$</span> : null}
                          <img className="harvest__img" src={w.wheat} alt=" " />
                        </div>
                  )
                }
              </div>
            </div>
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