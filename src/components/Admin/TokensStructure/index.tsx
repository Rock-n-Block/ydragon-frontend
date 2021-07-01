import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { IVault } from '../../../pages/AdminIndex';
import { Table } from '../../index';
import SmallTableCard from '../../SmallTableCard/index';

import './TokensStructure.scss';
import { InputNumber } from '../../Input';

interface TokensStructureProps {
  vaults: IVault[];
  manualRebalanceValue: string;
}

const TokensStructure: React.FC<TokensStructureProps> = ({ vaults, manualRebalanceValue }) => {
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
    {
      title: 'Estimated X Vault',
      dataIndex: 'estimated',
      key: 'estimated',
    },
    {
      title: 'Must be returned from the farm',
      dataIndex: 'returnValue',
      key: 'returnValue',
    },
    {
      title: 'APR, %',
      dataIndex: 'apr',
      key: 'apr',
      render: (item: any) => (
        <InputNumber type="number" defaultValue={item} placeholder="0" min={0} max={20} />
      ),
    },
  ];
  const [dataSource, setDataSource] = useState<any[]>([]);
  useEffect(() => {
    if (vaults) {
      const newData = vaults.map((vault, index) => {
        const x_vault = new BigNumber(vault.x_balance)
          .dividedBy(new BigNumber(10).pow(18))
          .toFixed(5);
        const y_vault = new BigNumber(vault.y_balance)
          .dividedBy(new BigNumber(10).pow(18))
          .toFixed(5);
        const farm = new BigNumber(vault.farm_balance)
          .dividedBy(new BigNumber(10).pow(18))
          .toFixed(5);
        const estimated = new BigNumber(x_vault)
          .plus(y_vault)
          .plus(farm)
          .multipliedBy(new BigNumber(manualRebalanceValue).dividedBy(100))
          .toFixed(5); // TODO: change multiplier
        const returnValue = new BigNumber(estimated).minus(x_vault).minus(y_vault).isLessThan(0)
          ? '0'
          : new BigNumber(estimated).minus(x_vault).minus(y_vault).toFixed(5);
        return {
          key: index,
          name: { image: vault.token_image, name: vault.token_name },
          x_vault,
          y_vault,
          farm,
          estimated,
          returnValue,
        };
      });
      setDataSource(newData);
    }
  }, [manualRebalanceValue, vaults]);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Tokens structure</h2>

      {vaults && (
        <>
          <div className="token-structure-table__big">
            <Table dataSource={dataSource} columns={columns} className="tokens-structure-table" />
          </div>
          <div className="token-structure-table__small">
            {dataSource.map((data, i) => (
              <SmallTableCard
                key={data.key}
                headerTitle="Tokens per index"
                tokenName={data.name.name}
                tokenLogo={data.name.image}
                index={i}
                data={[
                  ['X Vault', `${data.x_vault}%`],
                  ['Y Vault', `${data.y_vault}%`],
                  ['Farm', data.farm],
                  ['Estimated X Vault', data.estimated],
                  ['Must be returned from the farm', data.returnValue],
                  ['APR, %', <InputNumber type="number" placeholder="0" min={0} max={20} />],
                ]}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};
export default TokensStructure;
