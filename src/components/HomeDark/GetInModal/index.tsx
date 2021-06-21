import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { ContractTypes } from '../../../services/web3';
import { useMst } from '../../../store/store';
import { Button, Modal } from '../../index';
import './GetInModal.scss';
import SplittedTable, { ITableColumn, ITableData } from '../../SplittedTable';
import { TokenMiniProps } from '../../TokenMini';
import mockBinanceLogo from '../../../assets/img/tokens/bnb.svg';

const mockData: ITableData[] = [
  [
    {
      icon: mockBinanceLogo,
      name: 'Binance',
      symbol: 'bnb',
    } as TokenMiniProps,
    500000,
    '$367.81',
    183905000,
  ],
  [
    {
      icon: mockBinanceLogo,
      name: 'Binance',
      symbol: 'bnb',
    } as TokenMiniProps,
    500000,
    '$367.81',
    183905000,
  ],
  [
    {
      icon: mockBinanceLogo,
      name: 'Binance',
      symbol: 'bnb',
    } as TokenMiniProps,
    500000,
    '$367.81',
    183905000,
  ],
];
const totalColumns: ITableColumn[] = [
  {
    name: 'token',
    unShow: true,
  },
  {
    name: 'Quantity',
  },
  {
    name: 'Token price',
  },
  {
    name: 'Total price',
  },
];

const GetInModal: React.FC = observer(() => {
  const { modals, user } = useMst();
  const walletConnector = useWalletConnectorContext();
  const history = useHistory();

  const [isWBNBAllowed, setIsWBNBAllowed] = useState<boolean>(false);
  const [isUSDTAllowed, setIsUSDTAllowed] = useState<boolean>(false);

  const handleClose = (): void => {
    modals.getIn.close();
  };
  const setToken = (spender: ContractTypes) => {
    user.setToken(spender);
    handleClose();
    history.push('/index/2');
  };
  const handleApprove = (spender: ContractTypes) => {
    walletConnector.metamaskService
      .approve(spender)
      .then((data: any) => {
        console.log('approve', data);
      })
      .catch((err: any) => {
        console.log('approve error', err);
      });
  };
  const getTokenList = useCallback(() => {
    walletConnector.metamaskService.getTokensForIME();
    /* .then(() => {
        console.log('get tokens success');
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('approve error', response);
      }); */
  }, [walletConnector.metamaskService]);
  useEffect(() => {
    walletConnector.metamaskService
      .checkAllowance('WBNB')
      .then((data: boolean) => {
        console.log('check WBNB allowance', data);
        setIsWBNBAllowed(data);
      })
      .catch((err: any) => {
        console.log('check WBNB allowance error', err);
      });
    walletConnector.metamaskService
      .checkAllowance('USDT')
      .then((data: boolean) => {
        console.log('check USDT allowance', data);
        setIsUSDTAllowed(data);
      })
      .catch((err: any) => {
        console.log('check USDT allowance error', err);
      });
  }, [walletConnector.metamaskService]);
  useEffect(() => {
    getTokenList();
  }, [getTokenList]);
  return (
    <Modal isVisible={modals.getIn.isOpen} handleCancel={handleClose} className="m-get-in">
      <div className="m-get-in__content">
        <h2 className="m-get-in__title">Total for index</h2>
        <ul>
          <li>
            {' '}
            <Button onClick={() => setToken('BNB')}>BNB</Button>
          </li>
          {isWBNBAllowed && (
            <li>
              <Button onClick={() => setToken('WBNB')}>WBNB</Button>
            </li>
          )}
          {isUSDTAllowed && (
            <li>
              <Button onClick={() => setToken('USDT')}>USDT</Button>
            </li>
          )}
        </ul>
        <h2>Or approve new token</h2>
        <ul>
          {!isWBNBAllowed && (
            <li>
              <Button onClick={() => handleApprove('WBNB')}>Approve WBNB</Button>
            </li>
          )}

          {!isUSDTAllowed && (
            <li>
              <Button onClick={() => handleApprove('USDT')}>Approve USDT</Button>
            </li>
          )}
        </ul>

        <SplittedTable columns={totalColumns} data={mockData} />
      </div>
    </Modal>
  );
});
export default GetInModal;
