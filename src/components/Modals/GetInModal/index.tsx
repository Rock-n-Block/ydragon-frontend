import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
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

  const [currentIme, setCurrentIme] = useState<IIme | undefined>();
  const [totalData, setTotalData] = useState<ITableData[]>([] as ITableData[]);
  const [userData, setUserData] = useState<ITableData[]>([] as ITableData[]);
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(defaultTokens[0].name);
  const [payInput, setPayInput] = useState<string>('');
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
  const handleClose = (): void => {
    modals.getIn.close();
    setPayInput('');
  };
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
    setPayInput('');
  };
  const handleApprove = (): void => {
    setIsLoadingBtn(true);
    walletConnector.metamaskService
      .approve(firstCurrency, undefined, modals.getIn.address)
      .then(() => {
        setIsNeedApprove(false);
        modals.info.setMsg('Success', `Approve of ${firstCurrency} to IME success`, 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `Approve error ${message}`, 'error');
      })
      .finally(() => setIsLoadingBtn(false));
  };
  const handleEnter = (): void => {
    setIsLoadingBtn(true);
    walletConnector.metamaskService
      .enterIme(payInput, firstCurrency, modals.getIn.address)
      .then(() => {
        setPayInput('');
        modals.info.setMsg('Success', 'Success mint', 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log(message);
        modals.info.setMsg(
          'Error',
          `Mint error ${message.slice(0, message.indexOf(':'))}`,
          'error',
        );
      })
      .finally(() => setIsLoadingBtn(false));
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
        .finally(() => setIsLoading(false));
    }
  }, [user.address, modals.getIn.id]);
  const handlePayInput = (e: any) => {
    if (+e.target.value < 0) {
      e.target.value = '';
    } else {
      setPayInput(e.target.value);
    }
  };
  useEffect(() => {
    setIsLoading(true);
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
              key: nextId(),
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
                key: nextId(),
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
        {isLoading ? (
          <Spinner loading={isLoading} />
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
            onChange={handlePayInput}
            type="number"
          />
          <div className="m-get-in__btns">
            {isNeedApprove && firstCurrency !== 'BNB' && (
              <Button
                className="m-trade-ydr__btn"
                onClick={handleApprove}
                loading={isLoadingBtn}
                disabled={!user.address}
              >
                Approve
              </Button>
            )}
            {modals.tradeYDR.method === 'buy' && (!isNeedApprove || firstCurrency === 'BNB') && (
              <Button
                className="m-trade-ydr__btn"
                onClick={handleEnter}
                loading={isLoadingBtn}
                disabled={!user.address}
              >
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
