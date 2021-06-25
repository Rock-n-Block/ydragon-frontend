import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import coinIcon from '../../assets/img/future/icon-2.svg';
import { useWalletConnectorContext } from '../../services/walletConnect';
import { useMst } from '../../store/store';
import { Button } from '../index';

import './EventBanner.scss';

const EventBanner: React.FC = observer(() => {
  const { ime, modals } = useMst();
  const walletConnector = useWalletConnectorContext();
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());
  const [now, setNow] = useState(moment());
  // const mockStart = moment('20211207', 'YYYYDDMM');
  const [imeEnabled, setImeEnabled] = useState<boolean>(false);
  const [imeHidden, setImeHidden] = useState<boolean>(false);
  const handleGetIn = () => {
    if (ime.id && ime.address) {
      modals.getIn.open(ime.id, ime.address);
    }
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment());
    }, 1000);
    if (end.diff(now, 'seconds') < 0 || start.diff(now, 'seconds') > 0) {
      setImeEnabled(true);
    } else {
      setImeEnabled(false);
      if (end.diff(now, 'seconds') > 0) setImeHidden(true);
      else setImeHidden(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [start, end, now]);
  useEffect(() => {
    if (ime.address) {
      walletConnector.metamaskService
        .getStartDate(ime.address)
        .then((data: any) => {
          const dateInMilliseconds = new BigNumber(data).multipliedBy(1000).toString();
          setStart(moment(new Date(+dateInMilliseconds)));
        })
        .catch((err: any) => {
          console.log('get balance error', err);
        });
      walletConnector.metamaskService
        .getEndDate(ime.address)
        .then((data: any) => {
          const dateInMilliseconds = new BigNumber(data).multipliedBy(1000).toString();
          setEnd(moment(new Date(+dateInMilliseconds)));
        })
        .catch((err: any) => {
          console.log('get balance error', err);
        });
    }
  }, [ime.address, walletConnector.metamaskService]);
  return imeHidden ? (
    <div className="event-banner">
      <div className="container">
        <div className="event-banner__inner">
          <div className="event-banner__icon">
            <img src={coinIcon} alt="" width="66" height="75" />
          </div>

          <div className="event-banner-timer">
            <p className="event-banner-timer__title">
              INITIAL minting Event <span>{imeEnabled ? 'Starts in' : 'ends in'} </span>
            </p>

            <div className="event-banner-timer__row">
              <span className="event-banner-timer__time">
                <span className="text-gradient">
                  {start.diff(now, 'days') <= 0 ? end.diff(now, 'days') : start.diff(now, 'days')}
                  {/* {mockStart.diff(now, 'days') < 0 ? 0 : mockStart.diff(now, 'days')} */}
                </span>
                <span className="event-banner-timer__time-unit">Day</span>
              </span>
              <span className="event-banner-timer__colon text-gradient">:</span>
              <span className="event-banner-timer__time">
                <span className="text-gradient">
                  {start.diff(now, 'hours') < 0
                    ? end.diff(now, 'hours') % 24
                    : start.diff(now, 'hours') % 24}
                  {/* {mockStart.diff(now, 'hours') < 0 ? 0 : mockStart.diff(now, 'hours') % 24} */}
                </span>
                <span className="event-banner-timer__unit-item">Hours</span>
              </span>
              <span className="event-banner-timer__colon text-gradient">:</span>
              <span className="event-banner-timer__time">
                <span className="text-gradient">
                  {start.diff(now, 'minutes') < 0
                    ? end.diff(now, 'minutes') % 60
                    : start.diff(now, 'minutes') % 60}
                  {/* {mockStart.diff(now, 'minutes') < 0 ? 0 : mockStart.diff(now, 'minutes') % 60} */}
                </span>
                <span className="event-banner-timer__unit-item">Min</span>
              </span>
              <span className="event-banner-timer__colon text-gradient">:</span>
              <span className="event-banner-timer__time">
                <span className="text-gradient">
                  {start.diff(now, 'seconds') < 0
                    ? end.diff(now, 'seconds') % 60
                    : start.diff(now, 'seconds') % 60}
                  {/* {mockStart.diff(now, 'seconds') < 0 ? 0 : mockStart.diff(now, 'seconds') % 60} */}
                </span>
                <span className="event-banner-timer__unit-item">Sec</span>
              </span>
            </div>
          </div>

          <div className="event-banner__btns">
            <div className="event-banner__btns-inner">
              <Button onClick={handleGetIn} className="event-banner__get-btn" disabled={imeEnabled}>
                {' '}
                Enter!
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
          </div>
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
});

export default EventBanner;
