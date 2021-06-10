import React from 'react';
import { TokenPanel } from '../../index';

const IndexInfo: React.FC = () => {
  const panelInfo = [
    {
      label: 'Total supply',
      value: '10.000',
    },
    {
      label: 'Index price',
      value: '50836,13935',
    },
    {
      label: 'Price ',
      value: '5,083613935',
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
