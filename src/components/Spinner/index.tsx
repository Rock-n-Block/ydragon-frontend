import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';

import spinnerBlack from '../../assets/img/icons/spinner-black.svg';
import spinner from '../../assets/img/icons/spinner.svg';
import { DARK, useMst } from '../../store/store';

import './Spinner.scss';

interface SpinnerProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = observer((props: PropsWithChildren<SpinnerProps>) => {
  const { loading } = props;
  const { theme } = useMst();

  return loading ? (
    <div className="spinner">
      <img alt="" src={DARK === theme.value ? spinner : spinnerBlack} width="50" height="50" />
    </div>
  ) : (
    <></>
  );
});

export default Spinner;
