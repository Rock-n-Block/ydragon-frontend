import React from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import BigNumber from 'bignumber.js/bignumber';
import { withFormik } from 'formik';
import { observer } from 'mobx-react-lite';

import { ITokensDiff } from '../../../pages/Admin';
import { indexesApi } from '../../../services/api';
import { useMst } from '../../../store/store';
import Rebalance, { IRebalance } from '../component';
import { ProviderRpcError } from '../../../types';

interface IIndexId {
  indexId: string;
}
interface RebalanceFormProps {
  name: string;
  tokens: Array<ITokensDiff>;
  onStart: () => void;
}

const RebalanceForm: React.FC<RebalanceFormProps> = observer(({ name, tokens, onStart }) => {
  const { modals } = useMst();
  const { indexId } = useParams<IIndexId>();
  const FormWithFormik = withFormik<any, IRebalance>({
    enableReinitialize: true,
    mapPropsToValues: () => ({
      index: { name: '' || name } as { name: string },
      tokens:
        tokens?.map((tokenDiff) => {
          return {
            ...tokenDiff,
            deleting: false,
            new_weight: `${new BigNumber(tokenDiff.new_weight).multipliedBy(100).toNumber()}`,
          };
        }) || ([] as Array<ITokensDiff>),
      hours: 23,
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
      const formData = new FormData();
      formData.append('index', JSON.stringify({ name: values.index.name }));
      formData.append('tokens_diff', JSON.stringify(tokens_diff));
      formData.append('attempts_count', `${values.steps}`);
      const newData = {
        index: {
          name: values.index.name,
        },
        tokens_diff,
        attempts_count: +values.steps,
      };
      indexesApi
        .putIndexesRebalance(+indexId, newData)
        .then(() => {
          indexesApi
            .launchRebalance(+indexId)
            .then(() => {
              toast.success(`launch rebalance success`);
              onStart();
              modals.rebalance.close();
            })
            .catch((err: any) => {
              const { response } = err;
              toast.error(`Launch rebalance error ${response.data}`);
            })
            .finally(() => {
              setFieldValue('isLoading', false);
            });
        })
        .catch((err: ProviderRpcError) => {
          setFieldValue('isLoading', false);
          const { message } = err;
          toast.error(`Put rebalance error ${message}`);
        });
    },
    displayName: 'Rebalance',
  })(Rebalance);
  return <FormWithFormik />;
});

export default RebalanceForm;
