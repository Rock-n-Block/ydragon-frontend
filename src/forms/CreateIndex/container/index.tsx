import React from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { ISearchToken } from '../../../components/Search';
import { ITokensDiff } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import CreateIndex, { ICreateIndex } from '../component';
import txToast from '../../../components/ToastWithTxHash';
import { toast } from 'react-toastify';

const CreateIndexForm: React.FC = () => {
  const { modals } = useMst();
  const walletConnector = useWalletConnectorContext();
  const FormWithFormik = withFormik<any, ICreateIndex>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      name: '',
      symbol: '',
      price: '',
      dateRange: ['', ''],
      description: '',
      tokens: [] as Array<ITokensDiff>,
      isLoading: false,
      searchTokens: [] as Array<ISearchToken>,
      searchInput: '',
    }),
    handleSubmit: (values, { setFieldValue, resetForm }) => {
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
          [
            moment(values.dateRange ? values.dateRange[0] : '').format('X'),
            moment(values.dateRange ? values.dateRange[1] : '').format('X'),
          ],
          tokenAddresses,
          tokenWeights,
          new BigNumber(values.price).multipliedBy(new BigNumber(10).pow(18)).toString(10),
        )
        .on('transactionHash', (hash: string) => {
          txToast(hash);
          if (values.description) {
            indexesApi
              .addParamsToIndex(hash, values.description /* , values.price */)
              .catch((error) => {
                const { response } = error;
                console.error('description not added', response);
              })
              .finally(() => {
                resetForm({});
                setFieldValue('isLoading', false);
                modals.createIndex.close();
              });
          } else {
            resetForm({});
          }
        })
        .then(() => {
          toast.success('Index created');
        })
        .catch((error: ProviderRpcError) => {
          setFieldValue('isLoading', false);
          const { message } = error;
          toast.error('Something went wrong');
          console.error('Create index error', message);
        });
    },
    displayName: 'CreateIndex',
  })(CreateIndex);
  return <FormWithFormik />;
};

export default observer(CreateIndexForm);
