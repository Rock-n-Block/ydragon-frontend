import React from 'react';

import { Button } from '../../index';
import { Modal } from '../index';

import './HarvestModal.scss';

interface HarvestModalProps {
  onOk: () => void;
  text?: string;
  isOpen: boolean;
  handleClose: () => void;
  btnsStyles: Array<'outline' | undefined>;
}

const HarvestModal: React.FC<HarvestModalProps> = ({
  onOk,
  text,
  isOpen,
  handleClose,
  btnsStyles = ['outline', undefined],
}) => {
  return (
    <Modal
      isVisible={isOpen}
      className="m-harvest"
      handleCancel={handleClose}
      closeIcon
      destroyOnClose
      width={560}
    >
      <div className="m-harvest__content">
        <div className="m-harvest__title">Harvest and unstake</div>
        <div className="m-harvest__body">
          {text ||
            'If you unstake before the lockup period ends, you will incur a 25% penalty on your original stake. Are you sure you want to unstake now?'}
        </div>
        <div className="m-harvest__btns">
          <Button onClick={onOk} styledType={btnsStyles[0]}>
            Continue
          </Button>
          <Button onClick={handleClose} styledType={btnsStyles[1]}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HarvestModal;
