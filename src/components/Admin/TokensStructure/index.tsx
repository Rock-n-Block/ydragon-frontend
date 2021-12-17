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
import config from '../../../config';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';
import config_ABI from '../../../services/web3/config_ABI';
import { chainsEnum } from '../../../types';

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
  const [isDepositAvailable, setIsDepositAvailable] = useState(false);
  const [isWithdrawAvailable, setIsWithdrawAvailable] = useState(false);

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
      new BigNumber(vault.y_balance).minus(new BigNumber(vault.farm_balance)).toString(10),
    );
    walletConnect.walletService
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
      (vault) => vault.token_symbol === NATIVE_TOKENS[networks.currentNetwork as chainsEnum].native,
    );
    const preparedTokens = vaults
      .filter((vault) => vault.token_symbol !== nativeTokenValue?.token_symbol)
      .map((vault) => vault.farm_balance);
    walletConnect.walletService
      .depositToIndex(preparedTokens, indexAddress, nativeTokenValue?.farm_balance)
      .on('transactionHash', (hash: string) => {
        txToast(hash);
      })
      .then(() => {
        toast.success('Tokens successfully deposited');
        setIsDepositBtnLoading(false);
      })
      .catch((error: ProviderRpcError) => {
        const { message } = error;
        toast.error('Something went wrong');
        setIsDepositBtnLoading(false);
        console.error(`withdrawTokensForStaking error`, message);
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
      (vault) => vault.token_symbol === NATIVE_TOKENS[networks.currentNetwork as chainsEnum].native,
    );
    const filteredTokens = vaults
      .filter((vault) => vault.token_symbol !== nativeToken?.token_symbol)
      .map((vault) => vault.token_address);
    const newArray: string[] = [];

    const promiseArray = filteredTokens.map((address) => {
      return walletConnect.walletService
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
  }, [NATIVE_TOKENS, indexAddress, networks.currentNetwork, vaults, walletConnect.walletService]);

  const handleApproveAll = useCallback(async () => {
    setIsDepositBtnLoading(true);
    const approveRecursion = (index: number) => {
      if (index >= tokenAddressesNeedAllowance.length) {
        return;
      }
      walletConnect.walletService
        .approve(tokenAddressesNeedAllowance[index], indexAddress)
        .on('transactionHash', () => {
          approveRecursion(index + 1);
        })
        .then(() => {
          if (index >= tokenAddressesNeedAllowance.length) {
            setIsAllowed(true);
            setTokenAddressesNeedAllowance([]);
            setIsDepositBtnLoading(false);
          }
        });
    };
    // const promiseArray = tokenAddressesNeedAllowance.map((address) => {
    //   return handleApprove(address);
    // });
    try {
      // await Promise.all([...promiseArray]);
      const index = 0;
      approveRecursion(index);
    } catch (error) {
      console.error('TokensStructure approve error', error);
    }
  }, [indexAddress, tokenAddressesNeedAllowance, walletConnect.walletService]);
  const checkIsDepositAvailable = useCallback(() => {
    const isSomeFarmBalance = vaults.some((vault) =>
      new BigNumber(vault.farm_balance).isGreaterThan(0),
    );
    setIsDepositAvailable(isSomeFarmBalance);
  }, [vaults]);
  const checkIsWithdrawAvailable = useCallback(() => {
    const isSomeFarmBalance = vaults.some((vault) =>
      new BigNumber(vault.y_balance).minus(new BigNumber(vault.farm_balance)).isGreaterThan(0),
    );
    setIsWithdrawAvailable(isSomeFarmBalance);
  }, [vaults]);
  useEffect(() => {
    checkIsDepositAvailable();
  }, [checkIsDepositAvailable]);
  useEffect(() => {
    checkIsWithdrawAvailable();
  }, [checkIsWithdrawAvailable]);
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
          disabled={isWithdrawAvailable}
        >
          Withdraw
        </Button>
        {isAllowed ? (
          <Button
            styledType="outline"
            loading={isDepositBtnLoading}
            onClick={handleDepositClick}
            disabled={isDepositAvailable}
          >
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
