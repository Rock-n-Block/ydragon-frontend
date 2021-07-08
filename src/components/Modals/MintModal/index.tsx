import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import { Button, Input } from '../../index';
import { Modal } from '../index';

const MintModal: React.FC = observer(() => {
  const walletConnector = useWalletConnectorContext();
  const { user, modals } = useMst();
  const [value, setValue] = useState<string>('');
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };
  const handleSubmitMint = () => {
    walletConnector.metamaskService
      .mint(value, user.token)
      .then(() => {
        modals.info.setMsg('Success', 'Success mint', 'success');
      })
      .catch((err: ProviderRpcError) => {
        const { message } = err;
        modals.info.setMsg('mint error', message, 'error');
      });
  };
  const handleClose = (): void => {
    modals.mint.close();
  };
  const handleGetInOpen = (): void => {
    handleClose();
  };
  return (
    <Modal isVisible={modals.mint.isOpen} className="m-mint" handleCancel={handleClose}>
      <div className="m-mint__content">
        <h2>Enter amount of {user.token} to mint</h2>
        <div>
          <Input value={value} onChange={handleInputChange} />
          <Button onClick={handleSubmitMint}>Submit</Button>
        </div>
        <div role="button" onClick={handleGetInOpen} onKeyDown={handleGetInOpen} tabIndex={0}>
          Or change token
        </div>
      </div>
    </Modal>
  );
});

export default MintModal;
