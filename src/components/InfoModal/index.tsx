import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../store/store';
import { Button, Modal } from '../index';

import './InfoModal.scss';

const InfoModal: React.FC = observer(() => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.info.close();
  };

  return (
    <Modal
      isVisible={!!modals.info.msg}
      handleCancel={handleClose}
      destroyOnClose
      closeIcon
      className="m-info"
    >
      <div className="m-info__content">
        <h3 className={`m-info__title m-info__title-${modals.info.type}`}>{modals.info.title}</h3>
        <p className="m-info___msg">{modals.info.msg}</p>
        <Button onClick={handleClose}>Ok</Button>
      </div>
    </Modal>
  );
});

export default InfoModal;
