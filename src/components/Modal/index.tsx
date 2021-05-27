import React from 'react';
import { Modal as ModalAntd } from 'antd';
import classNames from 'classnames';

import { ReactComponent as CloseImg } from '../../assets/img/icons/icon-close.svg';

interface IModal {
  isVisible: boolean;
  handleCancel?: () => void;
  width?: number | string;
  className?: string;
  destroyOnClose?: boolean;
  closeIcon?: boolean;
}

const Modal: React.FC<IModal> = ({
                                   children,
                                   isVisible,
                                   handleCancel,
                                   width = 'fit-content',
                                   className,
                                   destroyOnClose = false,
                                   closeIcon = false,
                                 }) => {
  return (
    <ModalAntd
      title={false}
      visible={isVisible}
      footer={false}
      closable={closeIcon}
      closeIcon={<CloseImg />}
      onCancel={handleCancel}
      centered
      destroyOnClose={destroyOnClose}
      width={width}
      className={classNames('modal', className)}
    >
      {children}
    </ModalAntd>
  );
};

export default Modal;
