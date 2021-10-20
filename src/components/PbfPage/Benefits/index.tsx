import React, { ReactElement } from 'react';

import { JsonAnimation } from '../../index';
import { data } from './data';

import './Benefits.scss';

interface IBenefitItemProps {
  title: string;
  subtitle: string;
  icon: ReactElement<any, any>;
}

const BenefitItem: React.FC<IBenefitItemProps> = React.memo(({ title, subtitle, icon }) => {
  return (
    <li className="benefit_item">
      <div className="benefit_item__logo">{icon}</div>
      <div className="benefit_item__text">
        <div className="benefit_item__title text-MER">{title}</div>
        <div className="benefit_item__subtitle">{subtitle}</div>
      </div>
    </li>
  );
});

const Benefits: React.FC = () => {
  return (
    <section className="benefits section">
      <h2 className="text-gradient benefits-title">Benefits</h2>
      <ul className="benefits_items">
        {data.map((item) => (
          <BenefitItem
            key={`${item.title}-${item.subtitle}`}
            title={item.title}
            subtitle={item.subtitle}
            icon={<JsonAnimation animData={item.icon} height="62px" width="62px" />}
          />
        ))}
      </ul>
    </section>
  );
};

export default Benefits;
