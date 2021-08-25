import React, { useEffect, useState } from 'react';
import { Modal as ModalAntd } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

import { ReactComponent as CloseRed } from '../../../assets/img/icons/icon-close-red.svg';
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
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const getWindowWidth = () => {
      const { innerWidth } = window;
      return innerWidth;
    };
    useEffect(() => {
      function handleResize() {
        setWindowWidth(getWindowWidth());
      }

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    return (
      <ModalAntd
        title={false}
        visible={isVisible}
        footer={false}
        closable={windowWidth < 768 || closeIcon}
        // closable={closeIcon}
        closeIcon={windowWidth < 768 ? <CloseRed /> : <CloseImg />}
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
