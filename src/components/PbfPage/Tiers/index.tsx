import React from 'react';

import './Tiers.scss';

import { ReactComponent as Tier1 } from '../../../assets/img/pbf-page/tiers-tier-1.svg';
import { ReactComponent as Tier2 } from '../../../assets/img/pbf-page/tiers-tier-2.svg';

const Tiers: React.FC = () => {
  return (
    <section className="tiers section">
      <h2 className="tiers__title text-gradient">the tiers</h2>
      <div className="tiers__subtitle">
        Tier requirements needed to access the Private Blockchain Funds
      </div>
      <div className="tiers_items">
        <div className="tiers_item">
          <div className="tiers_item__logo">
            <Tier1 />
          </div>
          <div className="tiers_item__title text-MER">lottery den</div>
          <div className="tiers_item__price text-gradient">15 000 YDR</div>
          <div className="tiers_item__subtitle">
            Staked on YDragon platform or any partner platform
          </div>
        </div>
        <div className="tiers_item">
          <div className="tiers_item__logo">
            <Tier2 />
          </div>
          <div className="tiers_item__title text-MER">ruby den</div>
          <div className="tiers_item__price text-gradient">50 000 YDR</div>
          <div className="tiers_item__subtitle">
            Staked on YDragon platform or any partner platform
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tiers;
