import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';

import { IVault } from '../../../pages/AdminIndex';
import { Button, Table } from '../../index';
import SmallTableCard from '../../SmallTableCard/index';

import './TokensStructure.scss';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import txToast from '../../ToastWithTxHash';
import { ProviderRpcError } from '../../../types/errors';
import { toast } from 'react-toastify';
import config, { TChain } from '../../../config';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';
import config_ABI from '../../../services/web3/config_ABI';

interface TokensStructureProps {
  vaults: IVault[];
  indexAddress: string;
}

const TokensStructure: React.FC<TokensStructureProps> = observer(({ vaults, indexAddress }) => {
  const { networks } = useMst();
  const { NATIVE_TOKENS } = config;
  const walletConnect = useWalletConnectorContext();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [isWithdrawBtnLoading, setIsWithdrawBtnLoading] = useState(false);
  const [isDepositBtnLoading, setIsDepositBtnLoading] = useState(false);

  const [isAllowed, setIsAllowed] = useState(false);
  const [tokenAddressesNeedAllowance, setTokenAddressesNeedAllowance] = useState<string[]>([]);
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
  ];

  const handleWithdrawTokensClick = () => {
    setIsWithdrawBtnLoading(true);
    const preparedTokens = vaults.map((vault) =>
      new BigNumber(vault.y_balance).minus(new BigNumber(vault.farm_balance)).toString(),
    );
    walletConnect.metamaskService
      .withdrawTokensForStaking(preparedTokens, indexAddress)
      .on('transactionHash', (hash: string) => {
        txToast(hash);
      })
      .then(() => {
        toast.success('Tokens successfully withdrawed');
      })
      .catch((error: ProviderRpcError) => {
        const { message } = error;
        toast.error('Something went wrong');
        console.error(`withdrawTokensForStaking error`, message);
      })
      .finally(() => {
        setIsWithdrawBtnLoading(false);
      });
  };
  const handleDepositClick = () => {
    setIsDepositBtnLoading(true);
    const nativeTokenValue = vaults.find(
      (vault) => vault.token_symbol === NATIVE_TOKENS[networks.currentNetwork as TChain].native,
    );
    const preparedTokens = vaults
      .filter((vault) => vault.token_symbol !== nativeTokenValue?.token_symbol)
      .map((vault) => vault.farm_balance);
    walletConnect.metamaskService
      .depositToIndex(preparedTokens, indexAddress, nativeTokenValue)
      .on('transactionHash', (hash: string) => {
        txToast(hash);
      })
      .then(() => {
        toast.success('Tokens successfully deposited');
      })
      .catch((error: ProviderRpcError) => {
        const { message } = error;
        toast.error('Something went wrong');
        console.error(`withdrawTokensForStaking error`, message);
      })
      .finally(() => {
        setIsDepositBtnLoading(false);
      });
  };
  const prepareData = useCallback(() => {
    const newData = vaults.map((vault, index) => {
      const x_vault = new BigNumber(vault.x_balance)
        .dividedBy(new BigNumber(10).pow(vault.decimals))
        .toFixed(5);
      const farm = new BigNumber(vault.farm_balance)
        .dividedBy(new BigNumber(10).pow(vault.decimals))
        .toFixed(5);
      const y_vault = new BigNumber(
        new BigNumber(vault.y_balance).minus(new BigNumber(vault.farm_balance)),
      )
        .dividedBy(new BigNumber(10).pow(vault.decimals))
        .toFixed(5);
      return {
        key: index,
        name: { image: vault.token_image, name: vault.token_name },
        x_vault,
        y_vault,
        farm,
      };
    });
    setDataSource(newData);
  }, [vaults]);

  const checkAllowance = useCallback(async () => {
    const nativeToken = vaults.find(
      (vault) => vault.token_symbol === NATIVE_TOKENS[networks.currentNetwork as TChain].native,
    );
    const filteredTokens = vaults
      .filter((vault) => vault.token_symbol !== nativeToken?.token_symbol)
      .map((vault) => vault.token_address);
    const newArray: string[] = [];

    const promiseArray = filteredTokens.map((address) => {
      return walletConnect.metamaskService
        .checkAllowanceById(address, config_ABI.Token.ABI, indexAddress)
        .then((isApproved: boolean) => {
          if (!isApproved) {
            newArray.push(address);
          }
        });
    });
    try {
      await Promise.all([...promiseArray]);
      if (newArray.length) {
        setIsAllowed(false);
        setTokenAddressesNeedAllowance(newArray);
      } else {
        setIsAllowed(true);
        setTokenAddressesNeedAllowance([]);
      }
    } catch (error) {
      console.error('TokensStructure allowance error', error);
    }
  }, [NATIVE_TOKENS, indexAddress, networks.currentNetwork, vaults, walletConnect.metamaskService]);

  const handleApproveAll = useCallback(async () => {
    const promiseArray = tokenAddressesNeedAllowance.map((address) => {
      return walletConnect.metamaskService.approve(address, indexAddress);
    });
    try {
      await Promise.all([...promiseArray]);
      setIsAllowed(true);
      setTokenAddressesNeedAllowance([]);
    } catch (error) {
      console.error('TokensStructure approve error', error);
    }
  }, [indexAddress, tokenAddressesNeedAllowance, walletConnect.metamaskService]);

  useEffect(() => {
    if (vaults) {
      prepareData();
    }
  }, [prepareData, vaults]);
  useEffect(() => {
    if (vaults.length && indexAddress) {
      checkAllowance();
    }
  }, [checkAllowance, indexAddress, vaults]);
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
                ]}
              />
            ))}
          </div>
        </>
      )}
      <div className="token-structure__btns">
        <Button
          colorScheme="orange"
          loading={isWithdrawBtnLoading}
          onClick={handleWithdrawTokensClick}
        >
          Withdraw
        </Button>
        {isAllowed ? (
          <Button styledType="outline" loading={isDepositBtnLoading} onClick={handleDepositClick}>
            Deposit
          </Button>
        ) : (
          <Button styledType="outline" loading={isDepositBtnLoading} onClick={handleApproveAll}>
            Approve all
          </Button>
        )}
      </div>
    </section>
  );
});
export default TokensStructure;
