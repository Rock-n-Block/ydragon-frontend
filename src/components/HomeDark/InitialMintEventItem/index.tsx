import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';

import { useMst } from '../../../store/store';
import { Button } from '../../index';
import { IIme } from '../InitialMintEvent';

import './InitialMintEventItem.scss';

interface InitialMintEventItemProps {
  imeItem: IIme;
}

const InitialMintEventItem: React.FC<InitialMintEventItemProps> = ({ imeItem }) => {
  const { modals } = useMst();
  // const mockStart = moment('20211207', 'YYYYDDMM');
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());
  const [now, setNow] = useState(moment());
  const [imeEnabled, setImeEnabled] = useState<boolean>(false);
  const handleGetIn = () => {
    modals.getIn.open(imeItem.id, imeItem.address);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(moment());
    }, 1000);
    if (end.diff(now, 'seconds') < 0 || start.diff(now, 'seconds') > 0) {
      setImeEnabled(true);
    } else {
      setImeEnabled(false);
    }
    return () => {
      clearInterval(interval);
    };
  }, [now, end, start]);
  useEffect(() => {
    setEnd(
      moment(new Date(+new BigNumber(imeItem.ime_end_timestamp).multipliedBy(1000).toString())),
    );
    setStart(
      moment(new Date(+new BigNumber(imeItem.ime_start_timestamp).multipliedBy(1000).toString())),
    );
  }, [imeItem.ime_end_timestamp, imeItem.ime_start_timestamp]);
  return (
    <div className="initial-mint-event">
      <div className="initial-mint-event__timings">
        <div className="initial-mint-event__timing timing-start">
          <p className="initial-mint-event__timing-name">DAYS UNTIL AWAKENING</p>
          <p className="initial-mint-event__timer">
            <span className="initial-mint-event__timer-time">
              {start.diff(now, 'days') < 0 ? 0 : start.diff(now, 'days')}
              {/* {mockStart.diff(now, 'days') < 0 ? 0 : mockStart.diff(now, 'days')} */}
            </span>
            <span className="initial-mint-event__timer-colon">:</span>
            <span className="initial-mint-event__timer-time">
              {start.diff(now, 'hours') < 0 ? 0 : start.diff(now, 'hours') % 24}
              {/* {mockStart.diff(now, 'hours') < 0 ? 0 : mockStart.diff(now, 'hours') % 24} */}
            </span>
            <span className="initial-mint-event__timer-colon">:</span>
            <span className="initial-mint-event__timer-time">
              {start.diff(now, 'minutes') < 0 ? 0 : start.diff(now, 'minutes') % 60}
              {/* {mockStart.diff(now, 'minutes') < 0 ? 0 : mockStart.diff(now, 'minutes') % 60} */}
            </span>
            <span className="initial-mint-event__timer-colon">:</span>
            <span className="initial-mint-event__timer-time">
              {start.diff(now, 'seconds') < 0 ? 0 : start.diff(now, 'seconds') % 60}
              {/* {mockStart.diff(now, 'seconds') < 0 ? 0 : mockStart.diff(now, 'seconds') % 60} */}
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
          <p className="initial-mint-event__timing-name">DAYS BEFORE DISTRIBUTION</p>
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

          <div className="initial-mint-event__unit">
            <span className="initial-mint-event__unit-item">Day</span>
            <span className="initial-mint-event__unit-item">Hours</span>
            <span className="initial-mint-event__unit-item">Min</span>
            <span className="initial-mint-event__unit-item">Sec</span>
          </div>
        </div>
      </div>

      <div className="initial-mint-event__content">
        <h3 className="initial-mint-event__title">{imeItem.name} </h3>

        <p className="initial-mint-event__description">
          {imeItem.description ? imeItem.description : ''}
        </p>

        <Button
          onClick={handleGetIn}
          className="initial-mint-event__get-btn"
          tooltip="Please login"
          disabled={imeEnabled}
        >
          {' '}
          Enter!
        </Button>
      </div>
    </div>
  );
};
export default InitialMintEventItem;
