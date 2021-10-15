import React, { ReactElement } from 'react';

import './Benefits.scss';

import { ReactComponent as ItemLogo1 } from '../../../assets/img/pbf-page/benefits-item-1.svg';
import { ReactComponent as ItemLogo2 } from '../../../assets/img/pbf-page/benefits-item-2.svg';
import { ReactComponent as ItemLogo3 } from '../../../assets/img/pbf-page/benefits-item-3.svg';
import { ReactComponent as ItemLogo4 } from '../../../assets/img/pbf-page/benefits-item-4.svg';

interface IBenefitItemProps {
  title: string;
  subtitle: string;
  icon: ReactElement<any, any>;
}

const BenefitItem: React.FC<IBenefitItemProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="benefit_item">
      <div className="benefit_item__logo">{icon}</div>
      <div className="benefit_item__text">
        <div className="benefit_item__title text-MER">{title}</div>
        <div className="benefit_item__subtitle">{subtitle}</div>
      </div>
    </div>
  );
};

const Benefits: React.FC = () => {
  return (
    <section className="benefits section">
      <h2 className="benefits-title text-gradient">Benefits</h2>
      <div className="benefits_items">
        <BenefitItem
          title="Promising Projects"
          subtitle="Exposure to upcoming, highly promising projects on emerging chains."
          icon={<ItemLogo1 />}
        />
        <BenefitItem
          title="Upcoming
          Yield Farms"
          subtitle="Access to assets gaining yield farming opportunites found on emerging chains"
          icon={<ItemLogo2 />}
        />
        <BenefitItem
          title="New
          Usecases"
          subtitle="Exposure to new use cases that don’t currently have liquid projects to support them"
          icon={<ItemLogo3 />}
        />
        <BenefitItem
          title="NFT
          Exposure"
          subtitle="Exposure to non-fungible assets in a novel way"
          icon={<ItemLogo4 />}
        />
      </div>
    </section>
  );
};

export default Benefits;
