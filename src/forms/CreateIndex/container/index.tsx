import React from 'react';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { ITokensDiff } from '../../../pages/Admin';
import CreateIndex, { ICreateIndex } from '../component';

const CreateIndexForm: React.FC = () => {
  const FormWithFormik = withFormik<any, ICreateIndex>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      name: '',
      symbol: '',
      tokens: [] as Array<ITokensDiff>,
      isLoading: false,
    }),
    handleSubmit: (values, { setFieldValue }) => {
      setFieldValue('isLoading', true);
      // TODO: create request to contract
    },
    displayName: 'Rebalance',
  })(CreateIndex);
  return <FormWithFormik />;
};

export default observer(CreateIndexForm);
