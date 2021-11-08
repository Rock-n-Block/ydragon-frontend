import { GetInModal, MetamaskErrModal, ConnectWalletModal } from '../../components/Modals';
import React from 'react';

const Modals: React.FC = () => {
  return (
    <>
      <MetamaskErrModal />
      <GetInModal />
      <ConnectWalletModal />
    </>
  );
};
export default Modals;
