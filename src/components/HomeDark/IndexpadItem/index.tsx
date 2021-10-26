import React, { useCallback, useEffect, useState } from 'react';
import BigNumber from 'bignumber.js/bignumber';
import moment from 'moment';

import { useMst } from '../../../store/store';
import { Button } from '../../index';
import { IIme, IIndexpadToken } from '../Indexpad';

import './IndexpadItem.scss';
import IndexpadToken from './IndexpadToken';
import { useWalletConnectorContext } from '../../../services/walletConnect';
import { Sorter } from '../../../utils/sorter';
import indexpadOther from '../../../assets/img/indexpad-other.svg';

interface InitialMintEventItemProps {
  imeItem: IIme;
}

const IndexpadItem: React.FC<InitialMintEventItemProps> = ({ imeItem }) => {
  const { modals } = useMst();
  const walletConnector = useWalletConnectorContext();
  // const mockStart = moment('20211207', 'YYYYDDMM');
  const [userBalance, setUserBalance] = useState('0');
  const [start, setStart] = useState(moment());
  const [end, setEnd] = useState(moment());
  const [now, setNow] = useState(moment());
  const [imeEnabled, setImeEnabled] = useState<boolean>(false);
  const [tokens, setTokens] = useState<IIndexpadToken[]>(imeItem.tokens);
  const handleGetIn = () => {
    modals.getIn.open(imeItem.id, imeItem.address, imeItem.name);
  };
  const getUserBalance = useCallback(() => {
    walletConnector.metamaskService.getBalanceOf(imeItem.address).then((data: string | number) => {
      const formatedData = new BigNumber(data).dividedBy(new BigNumber(10).pow(18)).toFixed(6);
      setUserBalance(formatedData);
    });
  }, [imeItem.address, walletConnector.metamaskService]);
  const formatTokens = useCallback(() => {
    const compareFn = (a: IIndexpadToken, b: IIndexpadToken) =>
      Sorter.DEFAULT(a, b, true, 'unit_weight');
    if (imeItem.tokens.length >= 6) {
      const sortedTokens = imeItem.tokens.sort(compareFn);
      const firstFiveTokens = sortedTokens.slice(0, 5);
      const lastTokensWeight = firstFiveTokens
        .map((token) => token.unit_weight)
        .reduce((previousValue, currValue) =>
          new BigNumber(previousValue).plus(currValue).toString(),
        );
      const newToken = {
        unit_weight: new BigNumber(100)
          .minus(new BigNumber(lastTokensWeight).multipliedBy(100))
          .toString(2),
        name: 'Other',
        image: indexpadOther,
      } as IIndexpadToken;
      console.log('...firstFiveTokens, newToken', [...firstFiveTokens, newToken]);
      debugger;
      setTokens([...firstFiveTokens, newToken]);
    } else {
      debugger;
      setTokens(imeItem.tokens);
    }
  }, [imeItem.tokens]);
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
  useEffect(() => {
    if (imeItem.address) {
      getUserBalance();
    }
  }, [getUserBalance, imeItem.address]);
  useEffect(() => {
    formatTokens();
  }, [formatTokens]);
  return (
    <div className="initial-mint-event">
      <div className="initial-mint-event__row">
        <div className="initial-mint-event__timings">
          <div className="initial-mint-event__timing timing-start">
            <p className="initial-mint-event__timing-name">starting in</p>
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
            <p className="initial-mint-event__timing-name">ending in</p>
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
          <h3 className="initial-mint-event__title text-gradient">{imeItem.name} </h3>
          <div className="initial-mint-event__tokens">
            {tokens.map((token) => (
              <IndexpadToken token={token} key={`indexpad_${token.name}_token`} />
            ))}
          </div>
        </div>
      </div>
      <div className="initial-mint-event__row">
        <div className="initial-mint-event__col">
          <p className="initial-mint-event__about">About {imeItem.name}</p>
          <p className="initial-mint-event__description">
            {imeItem.description ? imeItem.description : ''}
          </p>
        </div>
        <div className="initial-mint-event__col">
          <div className="initial-mint-event__balance">
            <p className="initial-mint-event__balance-number text-gradient">{userBalance}</p>
            <p className="initial-mint-event__balance-text">Your Balance</p>
          </div>
          <Button
            onClick={handleGetIn}
            className="initial-mint-event__get-btn"
            needLogin="Please login"
            disabled={imeEnabled}
          >
            {' '}
            Enter!
          </Button>
        </div>
      </div>
    </div>
  );
};
export default IndexpadItem;
