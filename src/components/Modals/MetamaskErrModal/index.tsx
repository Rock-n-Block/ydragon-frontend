import React from 'react';
import { observer } from 'mobx-react-lite';

import MetamaskImg from '../../../assets/img/auth/metamask.svg';
import { useMst } from '../../../store/store';
import { Modal } from '../index';

import './MetamaskErrModal.scss';

const MetamaskErrModal: React.FC = observer(() => {
  const { modals } = useMst();
  const handleCancel = (): void => {
    modals.metamask.setErr('');
  };
  return (
    <Modal isVisible={!!modals.metamask.errMsg} className="m-metamask" handleCancel={handleCancel}>
      <div className="m-metamask__content">
        <img
          src={MetamaskImg}
          alt="metamask"
          className="m-metamask__img"
          width="107"
          height="111"
        />
        <p className="text-md">{modals.metamask.errMsg}</p>
      </div>
    </Modal>
  );
});

export default MetamaskErrModal;
