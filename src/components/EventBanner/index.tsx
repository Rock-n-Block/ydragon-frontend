import React, { useEffect, useState } from 'react';
// import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

// import { useWalletConnectorContext } from '../../../services/walletConnect';
// import { useMst } from '../../store/store';
// import { Button } from '../index';

import coinIcon from '../../assets/img/future/icon-2.svg';

import './EventBanner.scss';

const EventBanner: React.FC = observer(() => {
  // const { modals } = useMst();
  // const walletConnector = useWalletConnectorContext();
  // const [start, setStart] = useState(moment());
  const mockStart = moment('20211207', 'YYYYDDMM');
  // const [end, setEnd] = useState(moment());
  // const mockEnd = moment('20211008', 'YYYYDDMM');
  const [now, setNow] = useState(moment());
  // const handleGetIn = () => {
  //   modals.getIn.open();
  // };
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
    <div className="event-banner">
      <div className="container">
        <div className="event-banner__inner">
          <div className="event-banner__icon">
            <img src={coinIcon} alt="" width="66" height="75" />
          </div>

          <div className="event-banner-timer">
            <p className="event-banner-timer__title">INITIAL minting Event</p>

            <div className="event-banner-timer__row">
              <span className="event-banner-timer__time">
                {/* {start.diff(now, 'days') < 0 ? 0 : start.diff(now, 'days')} */}
                {mockStart.diff(now, 'days') < 0 ? 0 : mockStart.diff(now, 'days')}
              </span>
              <span className="event-banner-timer__colon">:</span>
              <span className="event-banner-timer__time">
                {/* {start.diff(now, 'hours') < 0 ? 0 : start.diff(now, 'hours') % 24} */}
                {mockStart.diff(now, 'hours') < 0 ? 0 : mockStart.diff(now, 'hours') % 24}
              </span>
              <span className="event-banner-timer__colon">:</span>
              <span className="event-banner-timer__time">
                {/* {start.diff(now, 'minutes') < 0 ? 0 : start.diff(now, 'minutes') % 60} */}
                {mockStart.diff(now, 'minutes') < 0 ? 0 : mockStart.diff(now, 'minutes') % 60}
              </span>
              <span className="event-banner-timer__colon">:</span>
              <span className="event-banner-timer__time">
                {/* {start.diff(now, 'seconds') < 0 ? 0 : start.diff(now, 'seconds') % 60} */}
                {mockStart.diff(now, 'seconds') < 0 ? 0 : mockStart.diff(now, 'seconds') % 60}
              </span>
            </div>
            <div className="event-banner-timer__unit">
              <span className="event-banner-timer__unit-item">Day</span>
              <span className="event-banner-timer__unit-item">Hours</span>
              <span className="event-banner-timer__unit-item">Min</span>
              <span className="event-banner-timer__unit-item">Sec</span>
            </div>
          </div>

          {/*  <div className="event-banner__btns">
            <div className="event-banner__btns-inner">
              <Button onClick={handleGetIn} className="event-banner__get-btn" disabled>
                {' '}
                GET IN!
              </Button>

              <Button
                link="/"
                type="text"
                styledType="clear"
                className="isDisabled event-banner__more-link"
              >
                Learn more
              </Button>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
});

export default EventBanner;
