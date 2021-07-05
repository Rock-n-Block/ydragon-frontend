import React, { PropsWithChildren } from 'react';

import spinner from '../../assets/img/icons/spinner.svg';

import './Spinner.scss';

interface SpinnerProps {
  loading: boolean;
}

const Spinner: React.FC<SpinnerProps> = (props: PropsWithChildren<SpinnerProps>) => {
  const { loading } = props;

  return loading ? (
    <div className="spinner">
      <img alt="" src={spinner} width="50" height="50" />
    </div>
  ) : (
    <></>
  );
};

export default Spinner;
