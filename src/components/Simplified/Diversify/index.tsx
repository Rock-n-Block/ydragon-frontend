import React from 'react';

import './diversify.scss';
import { Wheat } from '../components/index';

import WheatImg from '../../../assets/img/simplified/diversify/wheatY.svg';
import WheatBImg from '../../../assets/img/simplified/diversify/wheatB.svg';
import WheatRImg from '../../../assets/img/simplified/diversify/wheatR.svg';
import WheatPImg from '../../../assets/img/simplified/diversify/wheatP.svg';
import WheatGImg from '../../../assets/img/simplified/diversify/wheatG.svg';

interface IWheat {
  background: string;
  profit: boolean,
  wheat: string
}

interface IDiversify {
  name: string;
  emoji: string;
  description: string;
  wheats: IWheat[];
}

const Diversify: React.FC = () => {
  const diversifys: Array<IDiversify> = [
    {
      name: 'John',
      emoji: '🤔',
      description: `John has five fields, and plants five fields of wheat. He has not diversified his portfolio.`,
      wheats: [
        {
          background: 'normal',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatImg
        },
      ]
    },
    {
      name: 'David',
      emoji: '😌',
      description: `David also has 5 fields, but has planted a different crop in each one.`,
      wheats: [
        {
          background: 'normal',
          profit: false,
          wheat: WheatImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatBImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatRImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatPImg
        },
        {
          background: 'normal',
          profit: false,
          wheat: WheatGImg
        },
      ]
    }
  ]


  return (
    <section className="section diversify">
      <h2 className="section__title text-outline">Why Diversify?</h2>
      <div className="diversify__container">
        {
          diversifys.map((data: IDiversify) => 
            <Wheat name={data.name} emoji={data.emoji} description={data.description} wheat={data.wheats} />
          )
        }
      </div>
    </section>
  )
}

export default Diversify;