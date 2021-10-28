import React, { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { useMst } from './store/store';
import { Footer, Header } from './components';

import './styles/index.scss';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Modals, Routes } from './containers';

const App: React.FC = observer(() => {
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const main = useRouteMatch();
  const about = useRouteMatch('/about-us');
  const simplified = useRouteMatch('/simplified');
  const pbf = useRouteMatch('/pbf');
  const staking = useRouteMatch('/staking');
  const { theme } = useMst();
  const [bodyClass, setBodyClass] = useState('');

  const addClass = () => {
    let result;
    if (main.isExact) {
      result = `page-wrapper page-wrapper--home`;
    } else if (about) {
      result = `page-wrapper page-wrapper--about`;
    } else if (simplified) {
      result = `page-wrapper page-wrapper--simplified`;
    } else if (pbf) {
      result = `page-wrapper page-wrapper--pbf`;
    } else if (staking) {
      result = `page-wrapper page-wrapper--staking`;
    } else result = `page-wrapper`;
    return result;
  };

  useEffect(() => {
    if (bodyClass) {
      if (bodyClass !== theme.value) {
        document.body.classList.remove(bodyClass);
        document.body.classList.add(theme.value);
        setBodyClass(theme.value);
      }
    } else {
      document.body.classList.add(theme.value);
      setBodyClass(theme.value);
    }
  }, [theme.value, bodyClass]);
  const onCollapsedChange = (value: boolean) => {
    setCollapsed(value);
  };

  return (
    <div className={theme.value}>
      <ToastContainer />
      <div className={addClass()}>
        <Header collapsed={collapsed} onCollapsedChange={onCollapsedChange} />
        <div className={`${collapsed ? '' : 'expandWrapper'} content`}>
          <Routes />
          <Modals />
          <Footer />
        </div>
      </div>
    </div>
  );
});

export default App;
