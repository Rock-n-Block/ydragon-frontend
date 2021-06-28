import React from 'react';
import { observer } from 'mobx-react-lite';

import { CreateIndexForm } from '../../../forms';
import { useMst } from '../../../store/store';
import { Modal } from '../index';

import './CreateIndexModal.scss';

const CreateIndexModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.createIndex.close();
  };
  return (
    <Modal
      isVisible={modals.createIndex.isOpen}
      className="m-create-index"
      handleCancel={handleClose}
      closeIcon
      width={560}
    >
      <div className="m-create-index__content">
        <div className="m-create-index__title">Create new index</div>
        <CreateIndexForm />
      </div>
    </Modal>
  );
});
export default CreateIndexModal;
