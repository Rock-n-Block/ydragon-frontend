import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { Button, InputWithSelect, Modal } from '../../index';
import './GetInModal.scss';
import SplittedTable, { ITableColumn, ITableData } from '../../SplittedTable';
import { TokenMiniProps } from '../../TokenMini';
import mockBinanceLogo from '../../../assets/img/tokens/bnb.svg';
import { TokenMiniNameTypes, tokensArray } from '../../../utils/tokenMini';

const mockTotalData: ITableData[] = [
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
const mockUserData: ITableData[] = [
  [
    {
      icon: mockBinanceLogo,
      name: 'Binance',
      symbol: 'bnb',
    } as TokenMiniProps,
    100,
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
const userColumns: ITableColumn[] = [
  {
    name: 'token',
    unShow: true,
  },
  {
    name: 'Quantity',
  },
];

const GetInModal: React.FC = observer(() => {
  const { modals, user } = useMst();
  const walletConnector = useWalletConnectorContext();
  // const history = useHistory();

  // const [isWBNBAllowed, setIsWBNBAllowed] = useState<boolean>(false);
  // const [isUSDTAllowed, setIsUSDTAllowed] = useState<boolean>(false);

  const handleClose = (): void => {
    modals.getIn.close();
  };
  /* const setToken = (spender: ContractTypes) => {
    user.setToken(spender);
    handleClose();
    history.push('/index/2');
  }; */

  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(tokensArray[0].name);
  const [payInput, setPayInput] = useState<string>('0');
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const checkAllowance = useCallback(() => {
    walletConnector.metamaskService
      .checkAllowance(firstCurrency)
      .then((data: boolean) => {
        console.log(`allowance of ${firstCurrency}: ${data} `);
        setIsNeedApprove(!data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('allowance error', response);
      });
  }, [walletConnector.metamaskService, firstCurrency]);
  const handleSelectChange = (value: any) => {
    console.log(value);
    setFirstCurrency(value);
  };
  const handleApprove = (): void => {
    walletConnector.metamaskService
      .approve(firstCurrency)
      .then((data: any) => {
        setIsNeedApprove(false);
        console.log(`approve of ${firstCurrency} to IME success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('approve error', response);
      });
  };
  const handleBuy = (): void => {
    walletConnector.metamaskService
      .buyYDRToken(payInput, firstCurrency)
      .then((data: any) => {
        console.log(`buy of index for ${firstCurrency} success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('buy error', response);
      });
  };
  const handleSell = (): void => {
    walletConnector.metamaskService
      .sellYDRToken(payInput, firstCurrency)
      .then((data: any) => {
        console.log(`sell of index for ${firstCurrency} success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('sell error', response);
      });
  };

  useEffect(() => {
    setFirstCurrency(tokensArray[0].name);
  }, [modals.tradeYDR.method]);
  useEffect(() => {
    if (user.address) {
      checkAllowance();
    }
  }, [checkAllowance, user.address]);
  /* const getTokenList = useCallback(() => {
    walletConnector.metamaskService.getTokensForIME();
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
  }, [getTokenList]); */
  return (
    <Modal isVisible={modals.getIn.isOpen} handleCancel={handleClose} className="m-get-in">
      <div className="m-get-in__content">
        {/* <ul>
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
        </ul> */}
        <section className="m-get-in__total">
          <h2 className="m-get-in__title">Total for index</h2>
          <SplittedTable columns={totalColumns} data={mockTotalData} />
        </section>
        <section className="m-get-in__user">
          <h2 className="m-get-in__title">Total for User</h2>
          <SplittedTable columns={userColumns} data={mockUserData} />
        </section>
        <section className="m-get-in__you-pay">
          <h2 className="m-get-in__title">You pay</h2>
          <InputWithSelect
            tokens={tokensArray}
            onSelectChange={handleSelectChange}
            value={payInput}
            onChange={(event) => setPayInput(event.target.value)}
            type="number"
          />
          <div className="m-get-in__btns">
            {isNeedApprove && firstCurrency !== 'BNB' && (
              <Button className="m-trade-ydr__btn" onClick={handleApprove}>
                Approve
              </Button>
            )}
            {modals.tradeYDR.method === 'buy' && (!isNeedApprove || firstCurrency === 'BNB') && (
              <Button className="m-trade-ydr__btn" onClick={handleBuy}>
                Buy
              </Button>
            )}
            {modals.tradeYDR.method === 'sell' && (!isNeedApprove || firstCurrency === 'BNB') && (
              <Button className="m-trade-ydr__btn" onClick={handleSell}>
                Sell
              </Button>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
});
export default GetInModal;
