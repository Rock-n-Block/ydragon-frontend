import React from 'react';

import './diversify.scss';

import WheatImg from '../../../assets/img/simplified/diversify/wheatY.svg';
import WheatBImg from '../../../assets/img/simplified/diversify/wheatB.svg';
import WheatRImg from '../../../assets/img/simplified/diversify/wheatR.svg';
import WheatPImg from '../../../assets/img/simplified/diversify/wheatP.svg';
import WheatGImg from '../../../assets/img/simplified/diversify/wheatG.svg';





interface IDiversify {
  name: string;
  emoji: string;
  description: string;
  wheats: string[];
}

const Diversify: React.FC = () => {
  const diversifys: Array<IDiversify> = [
    {
      name: 'John',
      emoji: '🤔',
      description: `John has five fields, and plants five fields of wheat. He has not diversified his portfolio.`,
      wheats: [WheatImg,WheatImg,WheatImg,WheatImg,WheatImg]
    },
    {
      name: 'David',
      emoji: '😌',
      description: `David also has 5 fields, but has planted a different crop in each one.`,
      wheats: [WheatImg,WheatBImg,WheatRImg,WheatPImg,WheatGImg]
    }
  ]


  return (
    <section className="section diversify">
      <h2 className="section__title text-outline">Why Diversify?</h2>
      <div className="diversify__container">
        {
          diversifys.map((d: IDiversify) => 
            <div className="diversify__item">
              <div className="diversify__title-wrapper">
                <span className="diversify__title">{d.emoji} {d.name}</span>
              </div>
              <span className="diversify__subtitle">{d.description}</span>
              <div className="diversify__weats-wrapper">
                {
                  d.wheats.map(w => 
                    <div className="diversify__weat-wrapper">
                      <img className="diversify__img" src={w} alt=" " />
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
      </div>
    </section>
  )
}

export default Diversify;