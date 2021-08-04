import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import bncDark from '../../../assets/img/icons/icon-binance-dark.svg';
import bncLight from '../../../assets/img/icons/icon-binance-light.svg';
import { indexesApi } from '../../../services/api';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import config from '../../../services/web3/config';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { defaultTokens, ITokenMini, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { IIme } from '../../HomeDark/InitialMintEvent';
import { Button, Input, InputWithSelect } from '../../index';
import { Modal } from '../index';

import './GetInModal.scss';
import YDRLogo from '../../../assets/img/icons/logo.svg';
import BigNumber from 'bignumber.js/bignumber';
import plgDark from '../../../assets/img/icons/icon-polygon-dark.svg';
import plgLight from '../../../assets/img/icons/icon-polygon-light.svg';

const GetInModal: React.FC = observer(() => {
  const { modals, user, theme, networks } = useMst();
  const walletConnector = useWalletConnectorContext();

  const [currentIme, setCurrentIme] = useState<IIme | undefined>();
  const [whitelistTokens, setWhitelistTokens] = useState<Array<ITokenMini>>();
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes | string>(
    defaultTokens[0].name,
  );
  const [decimals, setDecimals] = useState<number>(18);
  const [payInput, setPayInput] = useState<string>('');
  const [viewOnlyInputValue, setViewOnlyInputValue] = useState<string>('0.0');
  const [balance, setBalance] = useState<number>(0);
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const networkToken = {
    bnb: {
      symbol: 'bnb',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      name: 'Binance Coin',
      image: theme.value === 'dark' ? bncDark : bncLight,
    },
    polygon: {
      symbol: 'matic',
      address: '0x0000000000000000000000000000000000000000',
      decimals: 18,
      name: 'Polygon (Matic)',
      image: theme.value === 'dark' ? plgDark : plgLight,
    },
  };

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
  const getBalance = useCallback(() => {
    walletConnector.metamaskService
      .getBalanceOf(findToken(firstCurrency)?.address)
      .then((data: any) => {
        setBalance(data);
        getDecimals(firstCurrency).then((dec: number) => {
          setDecimals(dec);
        });
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        console.log('getBalance error', message);
      });
  }, [findToken, getDecimals, walletConnector.metamaskService, firstCurrency]);
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
    setIsLoading(true);
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
      .finally(() => setIsLoading(false));
  };

  const handleEnter = (): void => {
    setIsLoading(true);
    walletConnector.metamaskService
      .mint(
        payInput,
        firstCurrency,
        findToken(firstCurrency)?.address,
        modals.getIn.address,
        decimals,
      )
      .then(() => {
        setPayInput('');
        getBalance();
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
      .finally(() => setIsLoading(false));
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

  const getBuyCourse = useCallback(() => {
    if (payInput) {
      walletConnector.metamaskService
        .getIndexCourse(
          findToken(firstCurrency)?.address,
          payInput,
          true,
          modals.getIn.address,
          decimals,
        )
        .then((data: any) => {
          setViewOnlyInputValue(
            new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(5),
          );
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          console.log('getBuyCourse error', message);
        });
    } else {
      setViewOnlyInputValue('0.0');
    }
  }, [
    findToken,
    modals.getIn.address,
    decimals,
    payInput,
    firstCurrency,
    walletConnector.metamaskService,
  ]);
  const handlePayInput = (e: any) => {
    if (+e.target.value < 0) {
      e.target.value = '';
    } else {
      setPayInput(e.target.value);
    }
  };

  useEffect(() => {
    getCurrentIme();
  }, [getCurrentIme]);

  useEffect(() => {
    if (currentIme) {
      setWhitelistTokens([
        networks.currentNetwork === 'binance-smart-chain' ? networkToken.bnb : networkToken.polygon,
        ...currentIme.tokens.map((token) => {
          return {
            name: token.name,
            symbol: token.symbol,
            address: token.address,
            image: token.image,
          };
        }),
      ]);
    }
  }, [
    networks.currentNetwork,
    networkToken.bnb,
    networkToken.polygon,
    theme.value,
    user.address,
    currentIme,
  ]);
  useEffect(() => {
    if (user.address) {
      checkAllowance();
    }
  }, [checkAllowance, user.address]);
  return (
    <Modal isVisible={!!modals.getIn.id} handleCancel={handleClose} className="m-get-in">
      <div className="m-get-in__content">
        <div className="m-get-in__logo">
          <img src={YDRLogo} alt="logo" width="55" height="100%" />
        </div>
        <h3 className="m-get-in__header">
          I want to enter to index mint event of
          <span className="m-trade-ydr__header-label"> {modals.getIn.name}</span>
        </h3>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">You pay</span>
            <span className="m-trade-ydr__label">
              Balance: {new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toFixed(7)}{' '}
            </span>
          </div>
          <InputWithSelect
            value={payInput}
            tokens={whitelistTokens ?? []}
            onSelectChange={handleSelectChange}
            onChange={handlePayInput}
            type="number"
            placeholder="0.0"
            onBlur={getBuyCourse}
          />
        </div>
        <div className="m-trade-ydr__field">
          <div className="m-trade-ydr__labels">
            <span className="m-trade-ydr__label">Your Receive</span>
          </div>

          <Input placeholder={viewOnlyInputValue} disabled />
        </div>
        {isNeedApprove && firstCurrency !== 'bnb' && firstCurrency !== 'matic' && (
          <Button className="m-trade-ydr__btn" onClick={handleApprove} loading={isLoading}>
            Approve
          </Button>
        )}
        {(!isNeedApprove || firstCurrency === 'bnb' || firstCurrency === 'matic') && (
          <Button
            className="m-trade-ydr__btn"
            onClick={handleEnter}
            disabled={!payInput}
            loading={isLoading}
          >
            Buy
          </Button>
        )}
      </div>
    </Modal>
  );
});
export default GetInModal;
