import { GetInModal, MetamaskErrModal } from '../../components/Modals';
import React from 'react';

const Modals: React.FC = () => {
  return (
    <>
      <MetamaskErrModal />
      <GetInModal />
    </>
  );
};
export default Modals;
