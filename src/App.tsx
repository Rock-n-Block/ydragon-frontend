import React, { useCallback, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from './store/store';
import { Footer, Header } from './components';

import './styles/index.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Modals, Routes } from './containers';
import cn from 'classnames';

const App: React.FC = observer(() => {
  const main = useRouteMatch();
  const about = useRouteMatch('/about-us');
  const simplified = useRouteMatch('/simplified');
  const pbf = useRouteMatch('/pbf');
  const staking = useRouteMatch('/staking');
  const { theme } = useMst();
  const [bodyClass, setBodyClass] = useState('');

  const addClass = useCallback(() => {
    if (main.isExact) {
      setBodyClass(`page-wrapper page-wrapper--home`);
    } else if (about) {
      setBodyClass(`page-wrapper page-wrapper--about`);
    } else if (simplified) {
      setBodyClass(`page-wrapper page-wrapper--simplified`);
    } else if (pbf) {
      setBodyClass(`page-wrapper page-wrapper--pbf`);
    } else if (staking) {
      setBodyClass(`page-wrapper page-wrapper--staking`);
    } else setBodyClass(`page-wrapper`);
  }, [about, main.isExact, pbf, simplified, staking]);

  useEffect(() => {
    addClass();
  }, [addClass]);

  return (
    <div className={cn(theme.value, bodyClass)}>
      <Header />
      <ToastContainer />
      <Routes />
      <Modals />
      <Footer />
    </div>
  );
});

export default App;
