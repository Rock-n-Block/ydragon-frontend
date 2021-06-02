import React from 'react';
import { ITokensDiff } from '../../../pages/Admin';
import { withFormik } from 'formik';
import Rebalance, { IRebalance } from '../component';
import { observer } from 'mobx-react-lite';
import { indexesApi } from '../../../services/api';

interface RebalanceFormProps {
  name: string;
  tokens: Array<ITokensDiff>;
}

const RebalanceForm: React.FC<RebalanceFormProps> = ({ name, tokens }) => {
  const FormWithFormik = withFormik<any, IRebalance>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      index: { name: '' || name } as { name: string },
      tokens: tokens || ([] as Array<ITokensDiff>),
      days: 30,
      hours: 30,
      steps: 30,
      isLoading: false,
    }),
    handleSubmit: (values, { setFieldValue }) => {
      setFieldValue('isLoading', true);
      const tokens_diff = values.tokens.map((tokenDiff) => {
        return {
          token: {
            count: tokenDiff.token.count,
            address: tokenDiff.token.address,
          },
          id: tokenDiff.id,
          new_weight: tokenDiff.token.current_weight,
        };
      });
      const term = +values.days * 24 + +values.hours;
      const formData = new FormData();
      formData.append('index', JSON.stringify({ name: values.index.name }));
      formData.append('tokens_diff', JSON.stringify(tokens_diff));
      formData.append('term', `${term}`);
      formData.append('attempts_count', `${values.steps}`);
      const newData = {
        index: {
          name: values.index.name,
        },
        tokens_diff,
        term,
        attempts_count: +values.steps,
      };
      indexesApi
        .putIndexesRebalance(2, newData)
        .then(({ data }) => {
          console.log('put rebalance success', data);
        })
        .catch((err) => {
          const { response } = err;
          console.log('put rebalance error', response);
        });
    },
    displayName: 'Rebalance',
  })(Rebalance);
  return <FormWithFormik />;
};

export default observer(RebalanceForm);
