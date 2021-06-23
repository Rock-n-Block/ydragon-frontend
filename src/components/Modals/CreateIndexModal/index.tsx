import React from 'react';
import { observer } from 'mobx-react-lite';
import { useMst } from '../../../store/store';
import { Modal } from '../index';

const CreateIndexModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.createIndex.close();
  };
  return (
    <Modal
      isVisible={modals.createIndex.isOpen}
      className="m-rebalance"
      handleCancel={handleClose}
      closeIcon
      width={560}
    >
      <div className="m-rebalance__content">
        <div className="rebalance-modal">
          <div className="rebalance-modal__title">Create index</div>
        </div>
      </div>
    </Modal>
  );
});
export default CreateIndexModal;
