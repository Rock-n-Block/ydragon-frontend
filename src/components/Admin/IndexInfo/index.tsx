import React from 'react';

import { TokenPanel } from '../../index';

interface IndexInfoProps {
  marketCap: string | number;
  price: string | number;
}

const IndexInfo: React.FC<IndexInfoProps> = ({ marketCap, price }) => {
  const panelInfo = [
    {
      label: 'Index price',
      value: `${marketCap}$`,
    },
    {
      label: 'Price ',
      value: `${price}$`,
    },
  ];
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">index info</h2>
      <div className="index-info">
        <TokenPanel panelContent={panelInfo} />
      </div>
    </section>
  );
};

export default IndexInfo;
