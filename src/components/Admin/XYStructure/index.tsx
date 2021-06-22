import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { IVaultMini } from '../../../pages/AdminIndex';
import { Table } from '../../index';

import './XYStructure.scss';

interface XYStructureProps {
  vaults: IVaultMini[];
}

const XYStructure: React.FC<XYStructureProps> = ({ vaults }) => {
  console.log(vaults);
  const columns: any[] = [
    {
      title: 'Vault',
      dataIndex: 'vault',
      key: 'vault',
      render: (item: any) => <span className="xy-structure-table__first-col">{item}</span>,
    },
    {
      title: 'Total price',
      dataIndex: 'price',
      key: 'price',
      render: (item: any) => <span className="text-gradient">{item}</span>,
    },
    {
      title: 'Weight, %',
      dataIndex: 'weight',
      key: 'weight',
    },
  ];

  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    if (vaults.length) {
      const newData = [
        {
          key: 0,
          vault: 'X Vault',
          price: `$${vaults[0].total_x}`,
          weight: `${new BigNumber(vaults[1].total_x).multipliedBy(100).toFixed(2)}%`,
        },
        {
          key: 1,
          vault: 'Y Vault',
          price: `$${vaults[0].total_y}`,
          weight: `${new BigNumber(vaults[1].total_y).multipliedBy(100).toFixed(2)}%`,
        },
      ];
      setDataSource(newData);
    }
  }, [vaults]);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">XY Structure</h2>

      {vaults && <Table dataSource={dataSource} columns={columns} className="xy-structure-table" />}
    </section>
  );
};

export default XYStructure;
