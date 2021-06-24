import React, { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';

import { useWalletConnectorContext } from '../../../services/walletConnect';
import { useMst } from '../../../store/store';
import { Button } from '../../index';
import { IIme } from '../InitialMintEvent';

import './InitialMintEventItem.scss';

interface InitialMintEventItemProps {
  imeItem: IIme;
}

const InitialMintEventItem: React.FC<InitialMintEventItemProps> = ({ imeItem }) => {
  const { modals } = useMst();
  const walletConnector = useWalletConnectorContext();
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
  }, [end, now, start]);
  useEffect(() => {
    walletConnector.metamaskService
      .getStartDate(imeItem.address)
      .then((data: any) => {
        const dateInMilliseconds = new BigNumber(data).multipliedBy(1000).toString();
        setStart(moment(new Date(+dateInMilliseconds)));
      })
      .catch((err: any) => {
        console.log('get balance error', err);
      });
    walletConnector.metamaskService
      .getEndDate(imeItem.address)
      .then((data: any) => {
        const dateInMilliseconds = new BigNumber(data).multipliedBy(1000).toString();
        setEnd(moment(new Date(+dateInMilliseconds)));
      })
      .catch((err: any) => {
        console.log('get balance error', err);
      });
  }, [imeItem.address, walletConnector.metamaskService]);
  useEffect(() => {
    console.log(imeItem);
  }, [imeItem]);
  return (
    <div className="initial-mint-event">
      <div className="initial-mint-event__timings">
        <div className="initial-mint-event__timing timing-start">
          <p className="initial-mint-event__timing-name">DAYS UNTIL AWAKENING</p>
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
        <h3 className="initial-mint-event__title">{imeItem.name}</h3>

        <p className="initial-mint-event__description">
          The BSC Top 5 Reputable Projects is a selection of the top 5 tokens listed across multiple
          chains on binance, in addition to YDR, that have the ability to produce a high yield.
        </p>

        <Button onClick={handleGetIn} className="initial-mint-event__get-btn" disabled={imeEnabled}>
          {' '}
          Enter!
        </Button>
      </div>
    </div>
  );
};
export default InitialMintEventItem;
