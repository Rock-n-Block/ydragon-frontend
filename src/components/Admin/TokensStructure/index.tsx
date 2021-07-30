import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';

import bluePlus from '../../../assets/img/icons/icon-plus-blue.svg';
import { IVault } from '../../../pages/AdminIndex';
import { indexesApi } from '../../../services/api';
import { Button, Table } from '../../index';
import { InputNumber } from '../../Input';
import SmallTableCard from '../../SmallTableCard/index';

import './TokensStructure.scss';

interface IIndexId {
  indexId: string;
}
interface TokensStructureProps {
  vaults: IVault[];
  manualRebalanceValue: string;
}

const TokensStructure: React.FC<TokensStructureProps> = ({ vaults, manualRebalanceValue }) => {
  const { indexId } = useParams<IIndexId>();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [inputs, setInputs] = useState<any[]>([]);
  const handleInputChange = (value: string | number, index: number) => {
    const newArr = [...inputs]; // copying the old datas array
    newArr[index] = value; // replace e.target.value with whatever you want to change it to
    setInputs(newArr);
  };
  const handleSubmitChange = () => {
    const aprArray = vaults.map((vault, index) => {
      return {
        id: vault.id,
        apr: inputs[index] || '0',
      };
    });
    indexesApi.patchIndexesApr(+indexId, aprArray).catch((err) => {
      console.log(err);
    });
  };
  const columns: any[] = [
    {
      title: 'Tokens per index',
      dataIndex: 'name',
      key: 'name',
      render: (item: any) => (
        <div className="table__col-with-logo">
          <img
            src={item.image}
            className="table__col-with-logo__image"
            alt={`${item.name} logo`}
            width="31"
            height="31"
          />
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
      title: (
        <div className="apr-cell">
          APR, %
          <Button onClick={handleSubmitChange} className="apr-cell__btn" styledType="clear">
            <img src={bluePlus} alt="add apr" width="32" height="32" />
          </Button>
        </div>
      ),
      dataIndex: 'apr',
      key: 'apr',
      render: (item: any) => (
        <InputNumber
          type="number"
          value={item.apr === '0.0' ? '' : item.apr}
          onChange={(value) => handleInputChange(value, item.index)}
          placeholder="0"
          min={0}
          max={100}
        />
      ),
    },
  ];
  useEffect(() => {
    if (vaults) {
      const aprArray = vaults.map((vault) => vault.apr || '');
      setInputs(aprArray);
    }
  }, [vaults]);
  useEffect(() => {
    if (vaults) {
      const newData = vaults.map((vault, index) => {
        const x_vault = new BigNumber(vault.x_balance)
          .dividedBy(new BigNumber(10).pow(18))
          .toFixed(5);
        const farm = new BigNumber(vault.farm_balance)
          .dividedBy(new BigNumber(10).pow(18))
          .toFixed(5);
        const y_vault = new BigNumber(
          new BigNumber(vault.y_balance).minus(new BigNumber(vault.farm_balance)),
        )
          .dividedBy(new BigNumber(10).pow(18))
          .toFixed(5);
        const estimated = new BigNumber(x_vault)
          .plus(y_vault)
          .plus(farm)
          .multipliedBy(new BigNumber(manualRebalanceValue || 0).dividedBy(100))
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
          apr: { apr: inputs[index], index },
        };
      });
      setDataSource(newData);
    }
  }, [inputs, manualRebalanceValue, vaults]);
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
                  ['X Vault', data.x_vault],
                  ['Y Vault', data.y_vault],
                  ['Farm', data.farm],
                  ['Estimated X Vault', data.estimated],
                  ['Must be returned from the farm', data.returnValue],
                  [
                    'APR, %',
                    <div className="apr-cell-small">
                      <InputNumber
                        type="number"
                        value={data.apr.apr === '0.0' ? '' : data.apr.apr}
                        onChange={(value) => handleInputChange(value, data.apr.index)}
                        placeholder="0"
                        min={0}
                        max={100}
                      />
                      <Button
                        onClick={handleSubmitChange}
                        className="apr-cell__btn"
                        styledType="clear"
                      >
                        <img src={bluePlus} alt="add apr" width="32" height="32" />
                      </Button>
                    </div>,
                  ],
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
