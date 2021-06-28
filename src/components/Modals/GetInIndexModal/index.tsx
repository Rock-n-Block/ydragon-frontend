import React, { useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { defaultTokens, TokenMiniNameTypes } from '../../../utils/tokenMini';
import { Button, InputWithSelect } from '../../index';
import SplittedTable, { ITableColumn, ITableData } from '../../SplittedTable';
import { Modal } from '../index';

import './GetInIndexModal.scss';

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
interface GetInIndexModalProps {
  totalData: ITableData[];
  indexAddress: string;
}
const GetInIndexModal: React.FC<GetInIndexModalProps> = observer(({ totalData, indexAddress }) => {
  const { modals, user } = useMst();
  const walletConnector = useWalletConnectorContext();

  const handleClose = (): void => {
    modals.getInIndex.close();
  };
  const [firstCurrency, setFirstCurrency] = useState<TokenMiniNameTypes>(defaultTokens[0].name);
  const [payInput, setPayInput] = useState<string>('0');
  const [isNeedApprove, setIsNeedApprove] = useState<boolean>(true);
  const checkAllowance = useCallback(() => {
    walletConnector.metamaskService
      .checkAllowance(firstCurrency, 'MAIN', indexAddress)
      .then((data: boolean) => {
        console.log(`allowance of ${firstCurrency}: ${data} `);
        setIsNeedApprove(!data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('allowance error', response);
      });
  }, [indexAddress, walletConnector.metamaskService, firstCurrency]);
  const handleSelectChange = (value: any) => {
    console.log(value);
    setFirstCurrency(value);
  };
  const handleApprove = (): void => {
    walletConnector.metamaskService
      .approve(firstCurrency, undefined, indexAddress)
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
      .mint(payInput, firstCurrency, indexAddress)
      .then((data: any) => {
        console.log('mint', data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('mint error', response);
      });
  };
  const handleSell = (): void => {
    walletConnector.metamaskService
      .redeem(payInput, firstCurrency, indexAddress)
      .then((data: any) => {
        console.log('mint', data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('mint error', response);
      });
  };
  useEffect(() => {
    setFirstCurrency(defaultTokens[0].name);
  }, [modals.tradeYDR.method]);
  useEffect(() => {
    if (user.address) {
      checkAllowance();
    }
  }, [checkAllowance, user.address]);
  return (
    <Modal isVisible={!!modals.getInIndex.isOpen} handleCancel={handleClose} className="m-get-in">
      <div className="m-get-in__content">
        <section className="m-get-in__total">
          <h2 className="m-get-in__title">Total for index</h2>
          <SplittedTable columns={totalColumns} data={totalData} />
        </section>
        <section className="m-get-in__you-pay">
          <h2 className="m-get-in__title">You pay</h2>
          <InputWithSelect
            tokens={defaultTokens}
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
            {(!isNeedApprove || firstCurrency === 'BNB') && (
              <>
                <Button className="m-trade-ydr__btn" onClick={handleBuy}>
                  Buy
                </Button>
                <Button className="m-trade-ydr__btn" onClick={handleSell}>
                  Sell
                </Button>
              </>
            )}
          </div>
        </section>
      </div>
    </Modal>
  );
});
export default GetInIndexModal;
