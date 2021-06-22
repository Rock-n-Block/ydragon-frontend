import React, { useEffect, useState } from 'react';

import { IVault } from '../../../pages/AdminIndex';
import { Table } from '../../index';

interface TokensStructureProps {
  vaults: IVault[];
}

const TokensStructure: React.FC<TokensStructureProps> = ({ vaults }) => {
  const columns: any[] = [
    {
      title: 'Tokens per index',
      dataIndex: 'name',
      key: 'name',
      render: (item: any) => (
        <div className="table__col-with-logo">
          <img src={item.image} className="table__col-with-logo__image" alt={`${item.name} logo`} />
          <span className="table__col-with-logo__text">{item.name}</span>
        </div>
      ),
    },
    {
      title: 'X Vault',
      dataIndex: 'x_vault',
      key: 'x_vault',
      render: (item: any) => <span className="text-gradient">{item}</span>,
    },
    {
      title: 'Y Vault',
      dataIndex: 'y_vault',
      key: 'y_vault',
    },
    {
      title: 'Farm',
      dataIndex: 'farm',
      key: 'farm',
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    if (vaults) {
      const newData = vaults.map((vault, index) => {
        return {
          key: index,
          name: { image: '', name: vault.token_name },
          x_vault: vault.x_balance,
          y_vault: vault.y_balance,
          farm: vault.farm_balance,
        };
      });
      setDataSource(newData);
    }
  }, [vaults]);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Tokens structure</h2>

      {vaults && (
        <Table dataSource={dataSource} columns={columns} className="tokens-structure-table" />
      )}
    </section>
  );
};
export default TokensStructure;
