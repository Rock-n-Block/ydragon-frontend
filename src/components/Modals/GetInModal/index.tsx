import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { indexesApi } from '../../../services/api';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { defaultTokens, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { IIme } from '../../HomeDark/InitialMintEvent';
import { Button, InputWithSelect, Spinner } from '../../index';
import SplittedTable, { ITableColumn, ITableData } from '../../SplittedTable';
import { TokenMiniProps } from '../../TokenMini';
import { Modal } from '../index';

import './GetInModal.scss';

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
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(defaultTokens[0].name);
  const [payInput, setPayInput] = useState<string>('');
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
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
      .then(() => {
        setIsNeedApprove(false);
        modals.info.setMsg('Success', `Approve of ${firstCurrency} to IME success`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `Approve error ${message}`, 'error');
      });
  };
  const handleEnter = (): void => {
    walletConnector.metamaskService
      .enterIme(payInput, firstCurrency, modals.getIn.address)
      .then(() => {
        modals.info.setMsg('Success', 'Success mint', 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `Mint error ${message}`, 'error');
      });
  };
  const getCurrentIme = useCallback(() => {
    if (modals.getIn.id) {
      indexesApi
        .getImeById(modals.getIn.id, user.address ? user.address : undefined)
        .then(({ data }) => {
          console.log('getCurrentIme success', data);
          setCurrentIme(data);
        })
        .catch((err: any) => {
          const { response } = err;
          console.log('getCurrentIme error', response);
        })
        .finally(() => setLoading(false));
    }
  }, [user.address, modals.getIn.id]);
  useEffect(() => {
    setLoading(true);
    getCurrentIme();
  }, [getCurrentIme]);
  useEffect(() => {
    setFirstCurrency(defaultTokens[0].name);
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
        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <>
            <section className="m-get-in__total">
              <h2 className="m-get-in__title">Total for index</h2>
              <SplittedTable columns={totalColumns} data={totalData} />
            </section>
            <section className="m-get-in__user">
              <h2 className="m-get-in__title">Total for User</h2>
              <SplittedTable columns={userColumns} data={userData} />
            </section>
          </>
        )}
        <section className="m-get-in__you-pay">
          <h2 className="m-get-in__title">You pay</h2>
          <InputWithSelect
            tokens={defaultTokens}
            onSelectChange={handleSelectChange}
            value={payInput}
            placeholder="0"
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
