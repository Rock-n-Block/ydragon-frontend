import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../../store/store';
import { Modal } from '../index';

import './HarvestModal.scss';
import { Button } from '../../index';

interface HarvestModalProps {
  isUnstake: boolean;
  onOk: () => void;
}

const HarvestModal: React.FC<HarvestModalProps> = ({ isUnstake, onOk }) => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.harvest.close();
  };
  return (
    <Modal
      isVisible={modals.harvest.isOpen}
      className="m-harvest"
      handleCancel={handleClose}
      closeIcon
      width={560}
    >
      <div className="m-harvest__content">
        <div className="m-harvest__title">{isUnstake ? 'Harvest and unstake' : 'Harvest'} </div>
        <div className="m-harvest__body">
          If you unstake before the lockup period ends, you will incur a 25% penalty on your
          original stake. Are you sure you want to unstake now?
        </div>
        <div className="m-harvest__btns">
          <Button onClick={onOk} styledType="outline">
            Continue
          </Button>
          <Button onClick={handleClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default observer(HarvestModal);
