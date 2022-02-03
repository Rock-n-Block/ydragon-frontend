import React from 'react';

import { ConnectWalletModal, GetInModal, MetamaskErrModal } from '../../components/Modals';

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
