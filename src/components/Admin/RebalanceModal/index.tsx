import React from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../../store/store';
import { Modal } from '../../index';

import './RebalanceModal.scss';
import { ITokensDiff } from '../../../pages/Admin';
import RebalanceForm from '../../../forms/Rebalance/container';

interface RebalanceModalProps {
  name:string;
  tokens: Array<ITokensDiff>;
}

const RebalanceModal: React.FC<RebalanceModalProps> = observer(({name, tokens }) => {
  const { modals } = useMst();

  const handleClose = (): void => {
    modals.rebalance.close();
  };
  return (
    <Modal
      isVisible={modals.rebalance.isOpen}
      className='m-rebalance'
      handleCancel={handleClose}
      width={800}
    >
      <div className='m-rebalance__content'>
        <div className='rebalance-modal-wrapper'>
          <div className='rebalance-modal'>
            <div
              role='button'
              className='rebalance-modal__close'
              onClick={() => modals.rebalance.close()}
              onKeyDown={() => modals.rebalance.close()}
              tabIndex={0}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='18'
                height='18'
                fill='none'
                viewBox='0 0 18 18'
              >
                <path
                  fill='#fff'
                  fillRule='evenodd'
                  d='M18 9A9 9 0 110 9a9 9 0 0118 0zM4.293 13.707a1 1 0 010-1.414L7.586 9 4.293 5.707a1 1 0 011.414-1.414L9 7.586l3.293-3.293a1 1 0 111.414 1.414L10.414 9l3.293 3.293a1 1 0 01-1.414 1.414L9 10.414l-3.293 3.293a1 1 0 01-1.414 0z'
                  clipRule='evenodd'
                />
              </svg>
            </div>

            <div className='rebalance-modal__title'>Rebalance {name}</div>

            <RebalanceForm name={name} tokens={tokens} />
          </div>
        </div>
      </div>
    </Modal>
  );
});

export default RebalanceModal;
