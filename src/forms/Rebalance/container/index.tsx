import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { ITokensDiff } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import { ProviderRpcError } from '../../../types/errors';
import Rebalance, { IRebalance } from '../component';

interface IIndexId {
  indexId: string;
}
interface RebalanceFormProps {
  name: string;
  tokens: Array<ITokensDiff>;
  onStart: () => void;
}

const RebalanceForm: React.FC<RebalanceFormProps> = observer(({ name, tokens, onStart }) => {
  const history = useHistory();
  const { modals } = useMst();
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
              onStart();
            })
            .catch((err: ProviderRpcError) => {
              const { message } = err;
              modals.info.setMsg('Error', `Launch rebalance error ${message}`, 'error');
              history.push('/admin');
            });
          modals.info.setMsg('Success', 'Put rebalance success', 'success');
        })
        .catch((err: ProviderRpcError) => {
          const { message } = err;
          modals.info.setMsg('Error', `Put rebalance error ${message}`, 'error');
        });
    },
    displayName: 'Rebalance',
  })(Rebalance);
  return <FormWithFormik />;
});

export default RebalanceForm;
