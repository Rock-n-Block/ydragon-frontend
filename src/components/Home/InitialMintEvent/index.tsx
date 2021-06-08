import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { Button } from '../../index';

import './InitialMintEvent.scss';

const InitialMintEvent: React.FC = observer(() => {
  const { modals } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());
  const [now, setNow] = useState(moment());
  const handleGetIn = () => {
    modals.getIn.open();
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  useEffect(() => {
    walletConnector.metamaskService
      .getStartDate()
      .then((data: any) => {
        const dateInMilliseconds = new BigNumber(data).multipliedBy(1000).toString();
        setStart(moment(new Date(+dateInMilliseconds)));
      })
      .catch((err: any) => {
        console.log('get balance error', err);
      });
    walletConnector.metamaskService
      .getEndDate()
      .then((data: any) => {
        const dateInMilliseconds = new BigNumber(data).multipliedBy(1000).toString();
        setEnd(moment(new Date(+dateInMilliseconds)));
      })
      .catch((err: any) => {
        console.log('get balance error', err);
      });
  }, [walletConnector.metamaskService]);
  return (
    <section className="section initial-mint-event">
      <div className="initial-mint-event__title-wrapper">
        <h2 className="initial-mint-event__title text-outline">INITIAL MINT EVENT</h2>
      </div>
      <div className="initial-mint-event__content">
        <p className="initial-mint-event__description">
          We are a diverse group of hackathon winners and fintech leaders from Australia, China and
          Malaysia. We’ve been building DeFi applications since 2017, unfortunately for a long time
          DeFi was not popular and we have always seen the biggest problem of DeFi products as a
          technology barrier thus we dedicated YDragon to solve this problem.
        </p>
        <div className="initial-mint-event__timings">
          <div className="initial-mint-event__timing timing-start">
            <p className="initial-mint-event__timing-name">days before start</p>
            <p className="initial-mint-event__timer">
              <span className="initial-mint-event__timer-time">
                {start.diff(now, 'days') < 0 ? 0 : start.diff(now, 'days')}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {start.diff(now, 'hours') < 0 ? 0 : start.diff(now, 'hours') % 24}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {start.diff(now, 'minutes') < 0 ? 0 : start.diff(now, 'minutes') % 60}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {start.diff(now, 'seconds') < 0 ? 0 : start.diff(now, 'seconds') % 60}
              </span>
            </p>
          </div>
          <div className="initial-mint-event__unit">
            <span>Day</span>
            <span>Hours</span>
            <span>Min</span>
            <span>Sec</span>
          </div>
          <div className="initial-mint-event__timing timing-finish">
            <p className="initial-mint-event__timing-name">days to finish</p>
            <p className="initial-mint-event__timer">
              <span className="initial-mint-event__timer-time">
                {end.diff(now, 'days') < 0 ? 0 : end.diff(now, 'days')}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {end.diff(now, 'hours') < 0 ? 0 : end.diff(now, 'hours') % 24}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {end.diff(now, 'minutes') < 0 ? 0 : end.diff(now, 'minutes') % 60}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {end.diff(now, 'seconds') < 0 ? 0 : end.diff(now, 'seconds') % 60}
              </span>
            </p>
          </div>
          <Button onClick={handleGetIn} className="initial-mint-event__get-btn">
            {' '}
            GET IN!
          </Button>
        </div>
      </div>
    </section>
  );
});

export default InitialMintEvent;
