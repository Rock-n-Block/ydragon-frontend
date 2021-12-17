import React from 'react';
// import { useParams } from 'react-router-dom';
// import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { ITokensDiff } from '../../../pages/Admin';
// import { indexesApi } from '../../../services/api';
// import { ProviderRpcError } from '../../../types';
// import { useMst } from '../../../store/store';
import Rebalance, { IRebalance } from '../component';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import txToast from '../../../components/ToastWithTxHash';

interface RebalanceFormProps {
  address: string;
  tokens: Array<ITokensDiff>;
  onStart: () => void;
}

const RebalanceForm: React.FC<RebalanceFormProps> = observer(({ address, tokens }) => {
  // const { modals } = useMst();
  const { walletService } = useWalletConnectorContext();
  const FormWithFormik = withFormik<any, IRebalance>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      tokens:
        tokens?.map((tokenDiff) => {
          return {
            ...tokenDiff,
            deleting: false,
            new_weight: `${new BigNumber(tokenDiff.new_weight).multipliedBy(100).toNumber()}`,
          };
        }) || ([] as Array<ITokensDiff>),
      isLoading: false,
    }),
    handleSubmit: (values, { setFieldValue }) => {
      setFieldValue('isLoading', true);
      const parsedTokens = values.tokens.map((tokenDiff) => {
        return {
          address: tokenDiff.token.address,
          new_weight: new BigNumber(tokenDiff.new_weight).multipliedBy(100).toFixed(0),
        };
      });
      const isWeightsSumValid = parsedTokens
        .reduce(
          (prevVal, currVal) => new BigNumber(prevVal).plus(currVal.new_weight),
          new BigNumber(0),
        )
        .isEqualTo(10000);
      if (!isWeightsSumValid) {
        return;
      }
      const tokenAddresses = parsedTokens.map((token) => token.address);
      const tokenWeights = parsedTokens.map((token) => token.new_weight);

      walletService
        .rebase(address, tokenAddresses, tokenWeights)
        .on('transactionHash', (hash) => {
          txToast(hash);
        })
        .then(() => {
          setFieldValue('isLoading', false);
        })
        .catch((err) => {
          console.error('RebalanceForm, handleSubmit err:', err);
          setFieldValue('isLoading', false);
        });
    },
    displayName: 'Rebalance',
  })(Rebalance);
  return <FormWithFormik />;
});

export default RebalanceForm;
