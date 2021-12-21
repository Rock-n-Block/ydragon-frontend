import React, { ReactElement } from 'react';

import { JsonAnimation } from '../../index';

import { data } from './data';

import './Tiers.scss';

interface ITierItemProps {
  title: string;
  price: string;
  subtitle: string;
  logo: ReactElement<any, any>;
}

const TierItem: React.FC<ITierItemProps> = React.memo(({ title, price, subtitle, logo }) => (
  <li className="tiers_item">
    <div className="tiers_item__logo">{logo}</div>
    <h2 className="tiers_item__title text-MER">{title}</h2>
    <p className="tiers_item__price text-gradient">{price}</p>
    <p className="tiers_item__subtitle">{subtitle}</p>
  </li>
));

const Tiers: React.FC = () => {
  return (
    <section className="tiers section">
      <h2 className="tiers__title text-gradient">the tiers</h2>
      <p className="tiers__subtitle">
        Tier requirements needed to access the Private Blockchain Funds
      </p>
      <ul className="tiers_items">
        {data.map((item) => (
          <TierItem
            key={`${item.price}-${item.subtitle}`}
            {...item}
            logo={<JsonAnimation animData={item.logo} height="200px" width="200px" />}
          />
        ))}
      </ul>
    </section>
  );
};

export default Tiers;
