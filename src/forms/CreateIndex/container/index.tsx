import React from 'react';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { ITokensDiff } from '../../../pages/Admin';
import CreateIndex, { ICreateIndex } from '../component';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import BigNumber from 'bignumber.js/bignumber';

const CreateIndexForm: React.FC = () => {
  const walletConnector = useWalletConnectorContext();
  const FormWithFormik = withFormik<any, ICreateIndex>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      name: '',
      symbol: '',
      startDate: '',
      endDate: '',
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
      walletConnector.metamaskService.createNewIndex(
        values.name,
        values.symbol,
        [values.startDate, values.endDate],
        tokenAddresses,
        tokenWeights,
      );
      // TODO: create request to contract
    },
    displayName: 'CreateIndex',
  })(CreateIndex);
  return <FormWithFormik />;
};

export default observer(CreateIndexForm);
