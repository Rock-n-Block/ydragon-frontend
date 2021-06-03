import React, { useState } from 'react';
import { Button, Input, Modal } from '../../index';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';
import { useWalletConnectorContext } from '../../../services/walletConnect';

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
      .then((data: any) => {
        console.log('mint', data);
      })
      .catch((err: any) => {
        const { response } = err;
        console.log('mint error', response);
      });
  };
  const handleClose = (): void => {
    modals.mint.close();
  };
  return (
    <Modal isVisible={modals.mint.isOpen} className="m-mint" handleCancel={handleClose}>
      <div className="m-mint__content">
        <h2>Enter amount to mint</h2>
        <div>
          <Input value={value} onChange={handleInputChange} />
          <Button onClick={handleSubmitMint}>Submit</Button>
        </div>
      </div>
    </Modal>
  );
});

export default MintModal;
