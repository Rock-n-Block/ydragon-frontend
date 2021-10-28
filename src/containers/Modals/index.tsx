import { GetInModal, InfoModal, MetamaskErrModal } from '../../components/Modals';
import React from 'react';

const Modals: React.FC = () => {
  return (
    <>
      <MetamaskErrModal />
      <InfoModal />
      <GetInModal />
    </>
  );
};
export default Modals;
