import React from 'react';
import config from '../../config';
import { toast } from 'react-toastify';
import { useMst } from '../../store/store';
import { observer } from 'mobx-react-lite';
import { chainsEnum } from '../../types';

interface IProps {
  txHash: string;
}

const ToastContentWithTxHash: React.FC<IProps> = observer(({ txHash }) => {
  const { EXPLORERS } = config;
  const { networks } = useMst();
  return (
    <>
      <p>Transaction submitted</p>
      <a
        href={`${EXPLORERS[networks.currentNetwork as chainsEnum]}/tx/${txHash}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        View in explorer
      </a>
    </>
  );
});
const txToast = (txHash: string) => toast.info(<ToastContentWithTxHash txHash={txHash} />);

export default txToast;
