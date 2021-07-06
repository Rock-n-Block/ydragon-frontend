import React from 'react';
import { Modal as ModalAntd } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ReactComponent as CloseImg } from '../../../assets/img/icons/icon-close.svg';
import { useMst } from '../../../store/store';

interface IModal {
  isVisible: boolean;
  handleCancel?: () => void;
  width?: number | string;
  className?: string;
  destroyOnClose?: boolean;
  closeIcon?: boolean;
}

const Modal: React.FC<IModal> = observer(
  ({
    children,
    isVisible,
    handleCancel,
    width = 'fit-content',
    className,
    destroyOnClose = false,
    closeIcon = false,
  }) => {
    const { theme } = useMst();
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
        className={classNames(`${theme.value} modal`, className)}
      >
        {children}
      </ModalAntd>
    );
  },
);

export default Modal;
