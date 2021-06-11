import React, { useEffect, useState } from 'react';
// import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

// import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { Button } from '../../index';

import './InitialMintEvent.scss';

const InitialMintEvent: React.FC = observer(() => {
  const { modals } = useMst();
  // const walletConnector = useWalletConnectorContext();
  // const [start, setStart] = useState(moment());
  const mockStart = moment('20211007', 'YYYYDDMM');
  // const [end, setEnd] = useState(moment());
  const mockEnd = moment('20211008', 'YYYYDDMM');
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
  /*  useEffect(() => {
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
  }, [walletConnector.metamaskService]); */
  return (
    <section className="section">
      <h2 className="section__title text-outline">INITIAL minting Event</h2>
      <p className="section__sub-title">Guaranteed YDR allocation for index minters</p>

      <div className="initial-mint-event">
        <div className="initial-mint-event__timings">
          <div className="initial-mint-event__timing timing-start">
            <p className="initial-mint-event__timing-name">days before start</p>
            <p className="initial-mint-event__timer">
              <span className="initial-mint-event__timer-time">
                {/* {start.diff(now, 'days') < 0 ? 0 : start.diff(now, 'days')} */}
                {mockStart.diff(now, 'days') < 0 ? 0 : mockStart.diff(now, 'days')}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {/* {start.diff(now, 'hours') < 0 ? 0 : start.diff(now, 'hours') % 24} */}
                {mockStart.diff(now, 'hours') < 0 ? 0 : mockStart.diff(now, 'hours') % 24}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {/* {start.diff(now, 'minutes') < 0 ? 0 : start.diff(now, 'minutes') % 60} */}
                {mockStart.diff(now, 'minutes') < 0 ? 0 : mockStart.diff(now, 'minutes') % 60}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {/* {start.diff(now, 'seconds') < 0 ? 0 : start.diff(now, 'seconds') % 60} */}
                {mockStart.diff(now, 'seconds') < 0 ? 0 : mockStart.diff(now, 'seconds') % 60}
              </span>
            </p>
            <div className="initial-mint-event__unit">
              <span className="initial-mint-event__unit-item">Day</span>
              <span className="initial-mint-event__unit-item">Hours</span>
              <span className="initial-mint-event__unit-item">Min</span>
              <span className="initial-mint-event__unit-item">Sec</span>
            </div>
          </div>

          <div className="initial-mint-event__timing timing-finish">
            <p className="initial-mint-event__timing-name">days to finish</p>
            <p className="initial-mint-event__timer">
              <span className="initial-mint-event__timer-time">
                {/* {end.diff(now, 'days') < 0 ? 0 : end.diff(now, 'days')} */}
                {mockEnd.diff(now, 'days') < 0 ? 0 : mockEnd.diff(now, 'days')}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {/* {end.diff(now, 'hours') < 0 ? 0 : end.diff(now, 'hours') % 24} */}
                {mockEnd.diff(now, 'hours') < 0 ? 0 : mockEnd.diff(now, 'hours') % 24}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {/* {end.diff(now, 'minutes') < 0 ? 0 : end.diff(now, 'minutes') % 60} */}
                {mockEnd.diff(now, 'minutes') < 0 ? 0 : mockEnd.diff(now, 'minutes') % 60}
              </span>
              <span className="initial-mint-event__timer-colon">:</span>
              <span className="initial-mint-event__timer-time">
                {/* {end.diff(now, 'seconds') < 0 ? 0 : end.diff(now, 'seconds') % 60} */}
                {mockEnd.diff(now, 'seconds') < 0 ? 0 : mockEnd.diff(now, 'seconds') % 60}
              </span>
            </p>

            <div className="initial-mint-event__unit">
              <span className="initial-mint-event__unit-item">Day</span>
              <span className="initial-mint-event__unit-item">Hours</span>
              <span className="initial-mint-event__unit-item">Min</span>
              <span className="initial-mint-event__unit-item">Sec</span>
            </div>
          </div>
        </div>

        <div className="initial-mint-event__content">
          <h3 className="initial-mint-event__title">B5 Index</h3>

          <p className="initial-mint-event__description">
            The BSC Top 5 Reputable Projects is a selection of the top 5 tokens listed across
            multiple chains on binance, in addition to YDR, that have the ability to produce a high
            yield.
          </p>

          <Button onClick={handleGetIn} className="initial-mint-event__get-btn" disabled>
            {' '}
            GET IN!
          </Button>
        </div>
      </div>
    </section>
  );
});

export default InitialMintEvent;
