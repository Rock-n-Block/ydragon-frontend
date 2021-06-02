import React, { useEffect, useState } from 'react';
import { Button, Modal } from '../../index';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { SpenderTypes } from '../../../services/web3';
import { useHistory } from 'react-router-dom';

const GetInModal: React.FC = observer(() => {
  const { modals, user } = useMst();
  const walletConnector = useWalletConnectorContext();
  const history = useHistory();

  const [isWBNBAllowed, setIsWBNBAllowed] = useState<boolean>(false);
  const [isYDRAllowed, setIsYDRAllowed] = useState<boolean>(false);
  const [isUSDTAllowed, setIsUSDTAllowed] = useState<boolean>(false);

  const handleClose = (): void => {
    modals.getIn.close();
  };
  const setToken = (spender: SpenderTypes) => {
    user.setToken(spender);
    handleClose();
    history.push('/index/2');
  };
  const handleApprove = (spender: SpenderTypes) => {
    walletConnector.metamaskService
      .approve(spender)
      .then((data: any) => {
        console.log('approve', data);
      })
      .catch((err: any) => {
        console.log('approve error', err);
      });
  };
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
      .checkAllowance('YDR')
      .then((data: boolean) => {
        console.log('check YDR allowance', data);
        setIsYDRAllowed(data);
      })
      .catch((err: any) => {
        console.log('check YDR allowance error', err);
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
  return (
    <Modal isVisible={modals.getIn.isOpen} handleCancel={handleClose} className="m-get-in">
      <div className="m-get-in__content">
        <h2>Get in with:</h2>
        <ul>
          {isWBNBAllowed && (
            <li>
              <Button onClick={() => setToken('WBNB')}>WBNB</Button>
            </li>
          )}
          {isYDRAllowed && (
            <li>
              {' '}
              <Button onClick={() => setToken('YDR')}>YDR</Button>
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

          {!isYDRAllowed && (
            <li>
              <Button onClick={() => handleApprove('YDR')}>Approve YDR token</Button>
            </li>
          )}

          {!isUSDTAllowed && (
            <li>
              <Button onClick={() => handleApprove('USDT')}>Approve USDT</Button>
            </li>
          )}
        </ul>
      </div>
    </Modal>
  );
});
export default GetInModal;
