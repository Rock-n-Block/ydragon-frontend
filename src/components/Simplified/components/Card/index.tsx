import React from 'react';

import './Card.scss';

import ReduceIcon from '../../../../assets/img/simplified/purpose/reduce.svg';
import IncreaseIcon from '../../../../assets/img/simplified/purpose/increase.svg';
import RiskImg from '../../../../assets/img/simplified/purpose/Risks.svg';
import IncomeImg from '../../../../assets/img/simplified/purpose/income.svg';
import { DARK, useMst } from '../../../../store/store';

interface ICard {
  title: string;
  icon: string;
  img: string;
  description: string;
}


const Card: React.FC = () => {
  const { theme } = useMst();

  const data: Array<ICard> = [
    { 
      title: 'Reduce risks',
      icon: ReduceIcon,
      img: RiskImg,
      description: `The difference here is that you invest in several coins at once. Such a group is called an index - it's safer this way, below we will explain why.`
    },
    { 
      title: 'Increase income',
      icon: IncreaseIcon,
      img: IncomeImg,
      description: `The coins in your index have value, with each offering opportunities to receive passive income - money earned without working!`
    },
  ];

  return (
         <>
          {data.map((item: ICard) =>
            <div className="card__item" key={item.title}>
              <div className={`card__title-wrapper-${DARK === theme.value ? 'Black' : 'White'}`}>
                <p className="card__title">{item.title}</p>
                <img  alt='' src={item.icon} />
              </div>
              <div className="card__img-wrapper">
              <img  alt='' className="card__img" src={item.img} />
              </div>
              <p className="card__text">{item.description}</p>
            </div>
          )}
        </>
  )
};

export default Card;