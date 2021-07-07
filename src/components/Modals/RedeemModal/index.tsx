import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { Button, Input } from '../../index';
import { Modal } from '../index';

const RedeemModal: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals } = useMst();
  const [value, setValue] = useState<string>('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };
  const handleSubmitRedeem = () => {
    walletConnector.metamaskService
      .redeem(value, user.token)
      .then(() => {
        modals.info.setMsg('Success', 'redeem success', 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('Error', `Redeem error ${message}`, 'error');
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
