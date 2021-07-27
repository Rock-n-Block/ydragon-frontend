import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { observer } from 'mobx-react-lite';

import { indexesApi } from '../../../services/api';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { defaultTokens, ITokenMini, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { IIme } from '../../HomeDark/InitialMintEvent';
import { Button, InputWithSelect, Spinner } from '../../index';
import SplittedTable, { ITableColumn, ITableData } from '../../SplittedTable';
import { TokenMiniProps } from '../../TokenMini';
import { Modal } from '../index';

import './GetInModal.scss';
import config from '../../../services/web3/config';
import bncDark from '../../../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../../../assets/img/icons/icon-binance-light.svg';

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
  const { modals, user, theme } = useMst();
  const walletConnector = useWalletConnectorContext();

  const [currentIme, setCurrentIme] = useState<IIme | undefined>();
  const [whitelistTokens, setWhitelistTokens] = useState<Array<ITokenMini>>();
  const [totalData, setTotalData] = useState<ITableData[]>([] as ITableData[]);
  const [userData, setUserData] = useState<ITableData[]>([] as ITableData[]);
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes | string>(
    defaultTokens[0].name,
  );
  const [decimals, setDecimals] = useState<number>(18);
  const [payInput, setPayInput] = useState<string>('');
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState<boolean>(false);
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const handleClose = (): void => {
    modals.getIn.close();
    setPayInput('');
  };
  const findToken = useCallback(
    (currency: string) => {
      return whitelistTokens?.find((token) => token.name.toLowerCase() === currency.toLowerCase());
    },
    [whitelistTokens],
  );
  const getDecimals = useCallback(
    async (currency: TokenMiniNameTypes | string) => {
      if (currency === 'BNB') {
        return new Promise((resolve) => resolve(18));
      }
      return walletConnector.metamaskService.getDecimals(
        findToken(currency)?.address,
        config.Token.ABI,
      );
    },
    [findToken, walletConnector.metamaskService],
  );
  const checkAllowance = useCallback(() => {
    if (firstCurrency !== 'BNB') {
      walletConnector.metamaskService
        .checkAllowanceById(
          findToken(firstCurrency)?.address,
          config.MAIN.ABI,
          modals.getIn.address,
        )
        .then((data: boolean) => {
          setIsNeedApprove(!data);
        })
        .catch((err: any) => {
          const { response } = err;
          console.log('allowance error', response);
        });
    }
  }, [findToken, modals.getIn.address, walletConnector.metamaskService, firstCurrency]);
  const handleSelectChange = (value: any) => {
    setFirstCurrency(value);
    setPayInput('');

    getDecimals(value).then((dec: number) => {
      setDecimals(dec);
    });
  };
  const handleApprove = (): void => {
    setIsLoadingBtn(true);
    walletConnector.metamaskService
      .approveById(findToken(firstCurrency)?.address, modals.getIn.address)
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
      .enterIme(
        payInput,
        firstCurrency,
        findToken(firstCurrency)?.address,
        modals.getIn.address,
        decimals,
      )
      .then(() => {
        setPayInput('');
        modals.info.setMsg('Success', 'You entered IME', 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg(
          'Error',
          `Enter IME error ${message.slice(0, message.indexOf(':'))}`,
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
    if (user.address) {
      checkAllowance();
    }
  }, [checkAllowance, user.address]);
  useEffect(() => {
    if (currentIme) {
      setWhitelistTokens([
        {
          name: 'BNB',
          address: '0x0000000000000000000000000000000000000000',
          logo: theme.value === 'dark' ? bncDark : bncLight,
        },
        ...currentIme.tokens.map((token) => {
          return {
            name: token.symbol,
            address: token.address,
            logo: token.image,
          };
        }),
      ]);
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
  }, [theme.value, user.address, currentIme]);
  return (
    <Modal
      isVisible={!!modals.getIn.id}
      // closeIcon={windowWidth < 500}
      handleCancel={handleClose}
      className="m-get-in"
    >
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
            tokens={whitelistTokens ?? defaultTokens}
            onSelectChange={handleSelectChange}
            value={payInput}
            placeholder="0"
            onChange={handlePayInput}
            type="number"
            getPopupContainer
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
            {(!isNeedApprove || firstCurrency === 'BNB') && (
              <Button
                className="m-trade-ydr__btn"
                onClick={handleEnter}
                loading={isLoadingBtn}
                disabled={!payInput || !user.address}
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
