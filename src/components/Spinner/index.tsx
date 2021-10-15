import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';

import spinnerLogo from '../../assets/img/icons/logo.svg';

// import spinner from '../../assets/img/icons/spinner.svg';
// import { DARK, useMst } from '../../store/store';
import './Spinner.scss';

interface SpinnerProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = observer((props: PropsWithChildren<SpinnerProps>) => {
  const { loading } = props;

  return loading ? (
    <div className="loader-container">
      <img className="loader-logo" alt="loading" src={spinnerLogo} width="50" height="50" />
      <div className="loader" />
    </div>
  ) : (
    <></>
  );
});

export default Spinner;
