import React from 'react';

import './Purpose.scss';

import ReduceIcon from '../../../assets/img/simplified/purpose/reduce.svg';
import IncreaseIcon from '../../../assets/img/simplified/purpose/increase.svg';
import RiskImg from '../../../assets/img/simplified/purpose/Risks.svg';
import IncomeImg from '../../../assets/img/simplified/purpose/income.svg';

interface IPurpose {
  title: string;
  icon: string;
  img: string;
  description: string;
}

const Purpose: React.FC = () => {

  const purposes: Array<IPurpose> = [
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
  ]

  return (
    <section className="section purpose">
      <h2 className="section__title text-outline">PURPOSE</h2>
      <div className="purpose__purpose-wrapper">
        {purposes.map((purpose: IPurpose) =>
          <div className="purpose__item">
            <div className="purpose__title-wrapper">
              <span className="purpose__title">{purpose.title}</span>
              <img  alt='' src={purpose.icon} />
            </div>
            <div className="purpose__img-wrapper">
              <img  alt='' className="purpose__img" src={purpose.img} />
            </div>
            <span className="purpose__text">{purpose.description}</span>
          </div>
        )}
      </div>
    </section>
  )
}

export default Purpose;