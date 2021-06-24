import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { TokenMiniNameTypes, tokensArray } from '../../../utils/tokenMini';
import { Button, InputWithSelect } from '../../index';
import SplittedTable, { ITableColumn, ITableData } from '../../SplittedTable';
import { TokenMiniProps } from '../../TokenMini';

import './GetInModal.scss';
import { Modal } from '../index';
import { indexesApi } from '../../../services/api';
import { IIme } from '../../HomeDark/InitialMintEvent';

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

  const handleClose = (): void => {
    modals.getIn.close();
  };
  const [currentIme, setCurrentIme] = useState<IIme | undefined>();
  const [totalData, setTotalData] = useState<ITableData[]>([] as ITableData[]);
  const [userData, setUserData] = useState<ITableData[]>([] as ITableData[]);
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(tokensArray[0].name);
  const [payInput, setPayInput] = useState<string>('0');
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const checkAllowance = useCallback(() => {
    walletConnector.metamaskService
      .checkAllowance(firstCurrency, 'MAIN', modals.getIn.address)
      .then((data: boolean) => {
        console.log(`allowance of ${firstCurrency}: ${data} `);
        setIsNeedApprove(!data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('allowance error', response);
      });
  }, [modals.getIn.address, walletConnector.metamaskService, firstCurrency]);
  const handleSelectChange = (value: any) => {
    console.log(value);
    setFirstCurrency(value);
  };
  const handleApprove = (): void => {
    walletConnector.metamaskService
      .approve(firstCurrency, undefined, modals.getIn.address)
      .then((data: any) => {
        setIsNeedApprove(false);
        console.log(`approve of ${firstCurrency} to IME success`, data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('approve error', response);
      });
  };
  const handleEnter = (): void => {
    walletConnector.metamaskService
      .enterIme(payInput, firstCurrency, modals.getIn.address)
      .then((data: any) => {
        console.log('mint', data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('mint error', response);
      });
  };
  const getCurrentIme = useCallback(() => {
    if (modals.getIn.id) {
      indexesApi
        .getImeById(modals.getIn.id, user.address ? user.address : undefined)
        .then(({ data }) => {
          setCurrentIme(data);
        })
        .catch((err: any) => {
          const { response } = err;
          console.log('mint error', response);
        });
    }
  }, [user.address, modals.getIn.id]);
  useEffect(() => {
    getCurrentIme();
  }, [getCurrentIme]);
  useEffect(() => {
    setFirstCurrency(tokensArray[0].name);
  }, [modals.tradeYDR.method]);
  useEffect(() => {
    if (user.address) {
      checkAllowance();
    }
  }, [checkAllowance, user.address]);
  useEffect(() => {
    if (currentIme) {
      setTotalData(
        currentIme.tokens.map((token) => {
          return [
            {
              icon: token.image,
              name: token.name,
              symbol: token.symbol,
            } as TokenMiniProps,
            token.total_quantity,
            `$${token.price}`,
            `$${token.total_price}`,
          ];
        }),
      );
      if (user.address) {
        setUserData(
          currentIme.tokens.map((token) => {
            return [
              {
                icon: token.image,
                name: token.name,
                symbol: token.symbol,
              } as TokenMiniProps,
              token.user_quantity ?? '0',
            ];
          }),
        );
      }
    }
  }, [user.address, currentIme]);
  return (
    <Modal isVisible={!!modals.getIn.id} handleCancel={handleClose} className="m-get-in">
      <div className="m-get-in__content">
        <section className="m-get-in__total">
          <h2 className="m-get-in__title">Total for index</h2>
          <SplittedTable columns={totalColumns} data={totalData} />
        </section>
        <section className="m-get-in__user">
          <h2 className="m-get-in__title">Total for User</h2>
          <SplittedTable columns={userColumns} data={userData} />
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
              <Button className="m-trade-ydr__btn" onClick={handleEnter}>
                Enter
              </Button>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
});
export default GetInModal;
