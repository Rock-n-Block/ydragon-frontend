import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { TransactionReceipt } from 'web3-core';

import { ITokensDiff } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { ProviderRpcError } from '../../../types/errors';
import { useMst } from '../../../store/store';
import CreateIndex, { ICreateIndex } from '../component';

const CreateIndexForm: React.FC = () => {
  const { modals } = useMst();
  const walletConnector = useWalletConnectorContext();
  const FormWithFormik = withFormik<any, ICreateIndex>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      name: '',
      symbol: '',
      startDate: '',
      endDate: '',
      description: '',
      tokens: [] as Array<ITokensDiff>,
      isLoading: false,
    }),
    handleSubmit: (values, { setFieldValue }) => {
      setFieldValue('isLoading', true);
      const tokenAddresses: Array<string> = [];
      const tokenWeights: Array<string> = [];
      values.tokens.forEach((token) => {
        tokenAddresses.push(token.token.address);
        tokenWeights.push(new BigNumber(token.new_weight).multipliedBy(100).toString(10));
      });
      walletConnector.metamaskService
        .createNewIndex(
          values.name,
          values.symbol,
          [values.startDate, values.endDate],
          tokenAddresses,
          tokenWeights,
        )
        .then((data: TransactionReceipt) => {
          indexesApi
            .addDescriptionToIndex(data.transactionHash, values.description)
            .then(() => {
              console.log('description added');
            })
            .catch((error: ProviderRpcError) => {
              const { message } = error;
              modals.info.setMsg('Error', message, 'error');
            });

          modals.info.setMsg('Success', 'Index created', 'success');
        })
        .catch((error: ProviderRpcError) => {
          const { message } = error;
          modals.info.setMsg('Error', message, 'error');
        });
      // TODO: create request to contract
    },
    displayName: 'CreateIndex',
  })(CreateIndex);
  return <FormWithFormik />;
};

export default observer(CreateIndexForm);
