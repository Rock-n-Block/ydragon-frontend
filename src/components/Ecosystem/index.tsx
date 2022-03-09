import React, { useState } from 'react';
import { ecosystem, ecosystemSetArray, TEcosystemSet } from './constants';
import './Ecosystem.scss';

const Ecosystem: React.FC = () => {
  const [ecosystemTab, setEcosystemTab] = useState<TEcosystemSet>('Products');
  return (
    <section className="section">
      <div className="ecosystem__tabs">
        {ecosystemSetArray.map((ecosystemTabName) => (
          <button
            type="button"
            key={`ecosystem-tab_${ecosystemTabName}`}
            className={`ecosystem__tabs_btn ${
              ecosystemTabName === ecosystemTab ? 'ecosystem__tabs_btn-active' : ''
            }`}
            onClick={() => {
              setEcosystemTab(ecosystemTabName);
            }}
          >
            {ecosystemTabName}
          </button>
        ))}
      </div>
      <div className="ecosystem__block">
        {ecosystem[ecosystemTab].map((Component) => (
          <Component />
        ))}
      </div>
    </section>
  );
};
export default Ecosystem;
