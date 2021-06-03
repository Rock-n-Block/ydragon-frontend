import React, { useState } from 'react';
import { Button, Input, Modal } from '../../index';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';
import { useWalletConnectorContext } from '../../../services/walletConnect';

const RedeemModal: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { modals } = useMst();
  const [value, setValue] = useState<string>('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };
  const handleSubmitRedeem = () => {
    walletConnector.metamaskService
      .redeem(value)
      .then((data: any) => {
        console.log('redeem', data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('redeem error', response);
      });
  };
  const handleClose = (): void => {
    modals.redeem.close();
  };
  return (
    <Modal isVisible={modals.redeem.isOpen} className="m-redeem" handleCancel={handleClose}>
      <div className="m-redeem__content">
        <h2>Enter amount to redeem</h2>
        <div>
          <Input value={value} onChange={handleInputChange} />
          <Button onClick={handleSubmitRedeem}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
});

export default RedeemModal;
