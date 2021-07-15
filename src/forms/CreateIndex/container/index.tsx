import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import { TransactionReceipt } from 'web3-core';

import { ITokensDiff } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import CreateIndex, { ICreateIndex } from '../component';
import moment from 'moment';

const CreateIndexForm: React.FC = () => {
  const { modals } = useMst();
  const walletConnector = useWalletConnectorContext();
  const FormWithFormik = withFormik<any, ICreateIndex>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      name: '',
      symbol: '',
      dateRange: ['', ''],
      description: '',
      tokens: [] as Array<ITokensDiff>,
      isLoading: false,
    }),
    handleSubmit: (values, { setFieldValue, resetForm }) => {
      setFieldValue('isLoading', true);
      console.log(values.dateRange);
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
          [
            moment(values.dateRange ? values.dateRange[0] : '').format('X'),
            moment(values.dateRange ? values.dateRange[1] : '').format('X'),
          ],
          tokenAddresses,
          tokenWeights,
        )
        .then((data: TransactionReceipt) => {
          if (values.description) {
            indexesApi
              .addDescriptionToIndex(data.transactionHash, values.description)
              .then(() => {
                resetForm({});
                modals.info.setMsg('Success', 'Index created with description', 'success');
              })
              .catch((error) => {
                const { response } = error;
                modals.info.setMsg(
                  'Index created',
                  `Description not added, error:\n${response.data}`,
                  'info',
                );
              })
              .finally(() => {
                setFieldValue('isLoading', false);
              });
          } else {
            resetForm({});
            modals.info.setMsg('Success', 'Index created', 'success');
          }

          modals.createIndex.close();
        })
        .catch((error: ProviderRpcError) => {
          setFieldValue('isLoading', false);
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
