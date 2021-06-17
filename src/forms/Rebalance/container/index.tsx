import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { ITokensDiff } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import Rebalance, { IRebalance } from '../component';

interface IIndexId {
  indexId: string;
}
interface RebalanceFormProps {
  name: string;
  tokens: Array<ITokensDiff>;
}

const RebalanceForm: React.FC<RebalanceFormProps> = ({ name, tokens }) => {
  const history = useHistory();
  const { indexId } = useParams<IIndexId>();
  const FormWithFormik = withFormik<any, IRebalance>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      index: { name: '' || name } as { name: string },
      tokens:
        tokens.map((tokenDiff) => {
          return {
            ...tokenDiff,
            deleting: false,
            new_weight: `${new BigNumber(tokenDiff.new_weight).multipliedBy(100).toNumber()}`,
          };
        }) || ([] as Array<ITokensDiff>),
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
          new_weight: new BigNumber(tokenDiff.new_weight).dividedBy(100).toString(10),
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
        .putIndexesRebalance(+indexId, newData)
        .then(({ data }) => {
          console.log('put rebalance success', data);
          indexesApi
            .launchRebalance(+indexId)
            .then((response) => {
              console.log('launch rebalance success', response);
            })
            .catch((err) => {
              const { response } = err;
              console.log('launch rebalance error', response);
              history.push('/admin');
            });
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
