import React, { PropsWithChildren } from 'react';
import { observer } from 'mobx-react-lite';

import spinner from '../../assets/img/icons/spinner.svg';
import spinnerBlack from '../../assets/img/icons/spinner-black.svg';

import './Spinner.scss';
import { useMst } from '../../store/store';

interface SpinnerProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = observer((props: PropsWithChildren<SpinnerProps>) => {
  const { loading } = props;
  const { theme } = useMst();

  return loading ? (
    <div className="spinner">
      <img alt="" src={theme.value === 'dark' ? spinner : spinnerBlack} width="50" height="50" />
    </div>
  ) : (
    <></>
  );
});

export default Spinner;
