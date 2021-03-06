import React from 'react';
import { observer } from 'mobx-react-lite';

import RebalanceForm from '../../../forms/Rebalance/container';
import { ITokensDiff } from '../../../pages/Admin';
import { useMst } from '../../../store/store';
import { Modal } from '../index';

import './RebalanceModal.scss';

interface RebalanceModalProps {
  address: string;
  name: string;
  tokens: Array<ITokensDiff>;
  onStart: () => void;
}

const RebalanceModal: React.FC<RebalanceModalProps> = observer(
  ({ address, name, tokens, onStart }) => {
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

            <RebalanceForm address={address} tokens={tokens} onStart={onStart} />
          </div>
        </div>
      </Modal>
    );
  },
);

export default RebalanceModal;
