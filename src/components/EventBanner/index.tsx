import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import { observer } from 'mobx-react-lite';
import moment from 'moment';

import coinIcon from '../../assets/img/gif/COINS_YDRAGON.gif';
import cross from '../../assets/img/icons/icon-close.svg';
import { indexesApi } from '../../services/api';
import { useMst } from '../../store/store';
import { IIme } from '../HomeDark/Indexpad';
import { Button } from '../index';

import './EventBanner.scss';

const EventBanner: React.FC = observer(() => {
  const { networks, modals } = useMst();
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());
  const [now, setNow] = useState(moment());
  // const mockStart = moment('20211207', 'YYYYDDMM');
  const [imeItem, setImeItem] = useState<IIme>({} as IIme);
  const [imeEnabled, setImeEnabled] = useState<boolean>(false);
  const [imeHidden, setImeHidden] = useState<boolean>(true);
  const [bannerHidden, setBannerHidden] = useState<boolean>(false);
  const handleGetIn = () => {
    modals.getIn.open(imeItem.id, imeItem.address, imeItem.name);
  };
  useEffect(() => {
    let interval: any;
    if (!imeHidden) {
      interval = setInterval(() => {
        setNow(moment());
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [start, end, now, imeHidden]);
  useEffect(() => {
    const endDiff = end.diff(now, 'seconds');
    const startDiff = start.diff(now, 'seconds');
    if (Number.isNaN(endDiff) || Number.isNaN(startDiff)) {
      setImeHidden(true);
    } else if (endDiff > 0 && startDiff < 0) {
      setImeEnabled(true);
      setImeHidden(false);
    } else {
      setImeEnabled(false);
      if (endDiff < 0) {
        setImeHidden(true);
      } else {
        setImeHidden(false);
      }
    }
  }, [start, end, now]);

  const getImeList = useCallback(() => {
    indexesApi
      .getImeIndexes()
      .then(({ data }) => {
        setImeItem(data[0]);
      })
      .catch((error) => {
        const { response } = error;
        console.log('get ime list error', response);
      });
  }, []);
  useEffect(() => {
    if (networks.currentNetwork) {
      getImeList();
    }
  }, [networks.currentNetwork, getImeList]);
  useEffect(() => {
    if (imeItem) {
      setEnd(
        moment(new Date(+new BigNumber(imeItem.ime_end_timestamp).multipliedBy(1000).toString())),
      );
      setStart(
        moment(new Date(+new BigNumber(imeItem.ime_start_timestamp).multipliedBy(1000).toString())),
      );
    }
  }, [imeItem]);

  return !imeHidden ? (
    <div className={bannerHidden ? 'hidden' : 'event-banner'}>
      <div className="container">
        <Button
          onClick={() => setBannerHidden(true)}
          className="event-banner__close"
          styledType="clear"
        >
          <img src={cross} alt="cross" width="20" height="20" />
        </Button>
        <div className="event-banner__inner">
          <div className="event-banner__icon">
            <img src={coinIcon} alt="coin" width="75" height="75" />
          </div>

          <div className="event-banner-timer">
            <p className="event-banner-timer__title">
              <span>
                {start.diff(now, 'seconds') > 0
                  ? 'DAYS UNTIL Index minting Event AWAKENING'
                  : 'DAYS BEFORE Index minting Event DISTRIBUTION'}{' '}
              </span>
            </p>

            <div className="event-banner-timer__row">
              <span className="event-banner-timer__time">
                {start.diff(now, 'seconds') || start.diff(now, 'seconds') === 0 ? (
                  <span className="text-gradient">
                    {start.diff(now, 'seconds') <= 0
                      ? end.diff(now, 'days')
                      : start.diff(now, 'days')}
                    {/* {mockStart.diff(now, 'days') < 0 ? 0 : mockStart.diff(now, 'days')} */}
                  </span>
                ) : (
                  ''
                )}
                <span className="event-banner-timer__time-unit">Day</span>
              </span>
              <span className="event-banner-timer__colon text-gradient">:</span>
              <span className="event-banner-timer__time">
                {start.diff(now, 'seconds') || start.diff(now, 'seconds') === 0 ? (
                  <span className="text-gradient">
                    {start.diff(now, 'seconds') <= 0
                      ? end.diff(now, 'hours') % 24
                      : start.diff(now, 'hours') % 24}
                    {/* {mockStart.diff(now, 'hours') < 0 ? 0 : mockStart.diff(now, 'hours') % 24} */}
                  </span>
                ) : (
                  ''
                )}
                <span className="event-banner-timer__unit-item">Hours</span>
              </span>
              <span className="event-banner-timer__colon text-gradient">:</span>
              <span className="event-banner-timer__time">
                {start.diff(now, 'seconds') || start.diff(now, 'seconds') === 0 ? (
                  <span className="text-gradient">
                    {start.diff(now, 'seconds') <= 0
                      ? end.diff(now, 'minutes') % 60
                      : start.diff(now, 'minutes') % 60}
                    {/* {mockStart.diff(now, 'minutes') < 0 ? 0 : mockStart.diff(now, 'minutes') % 60} */}
                  </span>
                ) : (
                  ''
                )}
                <span className="event-banner-timer__unit-item">Min</span>
              </span>
              <span className="event-banner-timer__colon text-gradient">:</span>
              <span className="event-banner-timer__time">
                {start.diff(now, 'seconds') || start.diff(now, 'seconds') === 0 ? (
                  <span className="text-gradient">
                    {start.diff(now, 'seconds') <= 0
                      ? end.diff(now, 'seconds') % 60
                      : start.diff(now, 'seconds') % 60}
                    {/* {mockStart.diff(now, 'seconds') < 0 ? 0 : mockStart.diff(now, 'seconds') % 60} */}
                  </span>
                ) : (
                  ''
                )}
                <span className="event-banner-timer__unit-item">Sec</span>
              </span>
            </div>
          </div>

          <div className="event-banner__btns">
            <div className="event-banner__btns-inner">
              <Button
                onClick={handleGetIn}
                className="event-banner__get-btn"
                disabled={!imeEnabled}
                needLogin="Please login"
              >
                {' '}
                Enter!
              </Button>

              <Button
                link="/"
                type="text"
                styledType="clear"
                className="isDisabled  event-banner__more-link"
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
