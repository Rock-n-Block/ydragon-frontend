import React from 'react';

import RebalanceForm from '../../../forms/Rebalance/container';
import { ITokensDiff } from '../../../pages/Admin';
import { useMst } from '../../../store/store';
import { Modal } from '../index';

import './RebalanceModal.scss';
import { observer } from 'mobx-react-lite';

interface RebalanceModalProps {
  name: string;
  tokens: Array<ITokensDiff>;
}

const RebalanceModal: React.FC<RebalanceModalProps> = ({ name, tokens }) => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.rebalance.close();
  };
  return (
    <Modal
      isVisible={modals.rebalance.isOpen}
      className="m-rebalance"
      handleCancel={handleClose}
      closeIcon
      width={560}
    >
      <div className="m-rebalance__content">
        <div className="rebalance-modal">
          <div className="rebalance-modal__title">Rebalance {name}</div>

          <RebalanceForm name={name} tokens={tokens} />
        </div>
      </div>
    </Modal>
  );
};

export default observer(RebalanceModal);
