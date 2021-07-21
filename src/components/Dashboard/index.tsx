import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';

import logo from '../../assets/img/icons/logo.svg';
import { IIndex } from '../../pages/Admin';
import { indexesApi } from '../../services/api';
import { Spinner } from '../index';

import IndexSmallCard from './SmallCard/index';

import './Dashboard.scss';
import { Sorter } from '../../utils/sorter';

export interface IUserIndex extends IIndex {
  name: string;
  market_cap: number;
  price: number;
  day: number;
  week: number;
  month: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [indexes, setIndexes] = useState<Array<IUserIndex>>();
  const [loading, setLoading] = useState<boolean>(false);
  const [sorterValue, setSorterValue] = useState<string>('');
  const [ascendent, setAscendent] = useState<boolean>(true);

  const calculateOthersWeight = (index: IUserIndex) => {
    const othersArray = index.tokens?.slice(3);
    let sum = new BigNumber(0);
    othersArray?.forEach((element) => {
      sum = sum.plus(new BigNumber(element.current_weight));
    });
    return sum;
  };

  const colorsClassNames = ['yellow', 'blue', 'red'];

  const getIndexes = useCallback(() => {
    setLoading(true);
    indexesApi
      .getUserIndexes()
      .then(({ data }) => {
        setIndexes(data);
      })
      .catch((error) => {
        const { response } = error;
        console.log('get indexes error', response);
      })
      .finally(() => setLoading(false));
  }, []);

  const switchSort = (value: string, asc: boolean) => {
    switch (value) {
      case 'name': {
        setIndexes(indexes?.sort((a, b) => Sorter.DEFAULT(a.name, b.name, asc)));
        break;
      }
      case 'market_cap': {
        setIndexes(indexes?.sort((a, b) => Sorter.DEFAULT(a.market_cap, b.market_cap, asc)));
        break;
      }
      case 'price': {
        setIndexes(indexes?.sort((a, b) => Sorter.DEFAULT(a.price, b.price, asc)));
        break;
      }
      case 'day': {
        setIndexes(indexes?.sort((a, b) => Sorter.DEFAULT(a.day, b.day, asc)));
        break;
      }
      case 'week': {
        setIndexes(indexes?.sort((a, b) => Sorter.DEFAULT(a.week, b.week, asc)));
        break;
      }
      case 'month': {
        setIndexes(indexes?.sort((a, b) => Sorter.DEFAULT(a.month, b.month, asc)));
        break;
      }
      case 'total': {
        setIndexes(indexes?.sort((a, b) => Sorter.DEFAULT(a.total, b.total, asc)));
        break;
      }

      default:
        break;
    }
  }

  const sorter = (item: string) => {
    if (sorterValue === item) {
      switchSort(item, !ascendent)
      setAscendent(!ascendent);
    } else {
      switchSort(item, true)
      setAscendent(true);
    }
    setSorterValue(item);
  };

  useEffect(() => {
    getIndexes();
  }, [getIndexes]);

  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Indexes</h2>
      <div className="index-dashboard__big">
        <div className="index-dashboard">
          {
          indexes?.filter((index) => index.price > 0).length ? (
            <div className="index-dashboard__row index-dashboard__row--head">
              <div className="index-dashboard__col">
                <div
                  className={`index-dashboard__sort ${
                    sorterValue === 'name'
                      ? `index-dashboard__sort${ascendent ? '--up' : ''}`
                      : ''
                  }`}
                  onClick={() => sorter('name')}
                  role="button"
                  onKeyDown={() => sorter('name')}
                  tabIndex={0}
                >
                  Name
                </div>
              </div>
              <div className="index-dashboard__col">
                <div
                  className={`index-dashboard__sort ${
                    sorterValue === 'market_cap'
                      ? `index-dashboard__sort${ascendent ? '--up' : ''}`
                      : ''
                  }`}
                  onClick={() => sorter('market_cap')}
                  role="button"
                  onKeyDown={() => sorter('market_cap')}
                  tabIndex={0}
                >
                  Market cap
                </div>
              </div>
              <div className="index-dashboard__col">
                <div
                  className={`index-dashboard__sort ${
                    sorterValue === 'price'
                      ? `index-dashboard__sort${ascendent ? '--up' : ''}`
                      : ''
                  }`}
                  onClick={() => sorter('price')}
                  role="button"
                  onKeyDown={() => sorter('price')}
                  tabIndex={0}
                >
                  Price
                </div>
              </div>
              <div className="index-dashboard__col">
                <div
                  className={`index-dashboard__sort ${
                    sorterValue === 'day'
                      ? `index-dashboard__sort${ascendent ? '--up' : ''}`
                      : ''
                  }`}
                  onClick={() => sorter('day')}
                  role="button"
                  onKeyDown={() => sorter('day')}
                  tabIndex={0}
                >
                  1 Day
                </div>
              </div>
              <div className="index-dashboard__col">
                <div
                  className={`index-dashboard__sort ${
                    sorterValue === 'week'
                      ? `index-dashboard__sort${ascendent ? '--up' : ''}`
                      : ''
                  }`}
                  onClick={() => sorter('week')}
                  role="button"
                  onKeyDown={() => sorter('week')}
                  tabIndex={0}
                >
                  1 week
                </div>
              </div>
              <div className="index-dashboard__col">
                <div
                  className={`index-dashboard__sort ${
                    sorterValue === 'month'
                      ? `index-dashboard__sort${ascendent ? '--up' : ''}`
                      : ''
                  }`}
                  onClick={() => sorter('month')}
                  role="button"
                  onKeyDown={() => sorter('month')}
                  tabIndex={0}
                >
                  1 month
                </div>
              </div>
              <div className="index-dashboard__col">
                <div
                  className={`index-dashboard__sort ${
                    sorterValue === 'total'
                      ? `index-dashboard__sort${ascendent ? '--up' : ''}`
                      : ''
                  }`}
                  onClick={() => sorter('total')}
                  role="button"
                  onKeyDown={() => sorter('total')}
                  tabIndex={0}
                >
                  Since Inception
                </div>
              </div>
            </div>
          ) : (
            <></>
          )}

          <Spinner loading={loading} />
          {indexes?.length ? (
            <div className="index-dashboard__content">
              {indexes
                .filter((index) => index.price > 0)
                .map((index: IUserIndex) => (
                  <div className="index-dashboard__item" key={nextId()}>
                    <div className="index-dashboard__row">
                      <Link to={`/index/${index.id}`} className="index-dashboard__col">
                        <div className="index-dashboard__info">
                          <img
                            src={logo}
                            alt="ydr-logo"
                            width="31"
                            height="28"
                            className="index-dashboard__icon"
                          />

                          <div className="index-dashboard__name">{index.name}</div>
                        </div>
                      </Link>
                      <div className="index-dashboard__col">
                        <div className="index-dashboard__market-cup">${index.market_cap}</div>
                      </div>
                      <div className="index-dashboard__col">
                        <div className="index-dashboard__price">${index.price}</div>
                      </div>
                      <div className="index-dashboard__col">
                        <div
                          className={`index-dashboard__percent ${
                            index.day > 0
                              ? 'index-dashboard__percent--up'
                              : 'index-dashboard__percent--down'
                          }`}
                        >
                          {new BigNumber(index.day).multipliedBy(100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="index-dashboard__col">
                        <div
                          className={`index-dashboard__percent ${
                            index.week > 0
                              ? 'index-dashboard__percent--up'
                              : 'index-dashboard__percent--down'
                          }`}
                        >
                          {new BigNumber(index.week).multipliedBy(100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="index-dashboard__col">
                        <div
                          className={`index-dashboard__percent ${
                            index.month > 0
                              ? 'index-dashboard__percent--up'
                              : 'index-dashboard__percent--down'
                          }`}
                        >
                          {new BigNumber(index.month).multipliedBy(100).toFixed(2)}%
                        </div>
                      </div>
                      <div className="index-dashboard__col">
                        <div
                          className={`index-dashboard__percent ${
                            index.total > 0
                              ? 'index-dashboard__percent--up'
                              : 'index-dashboard__percent--down'
                          }`}
                        >
                          {new BigNumber(index.total).multipliedBy(100).toFixed(2)}%
                        </div>
                      </div>

                      <div className="index-dashboard__tokens">
                        {index.tokens &&
                          index.tokens.slice(0, 3).map((token, i) => (
                            <div key={nextId()} className="index-dashboard__token">
                              <span
                                className={`index-dashboard__token-color ${colorsClassNames[i]}`}
                              />
                              <span className="index-dashboard__token-name">{token.symbol}</span>
                            </div>
                          ))}

                        {index.tokens.length > 3 && (
                          <div className="index-dashboard__token">
                            <span className="index-dashboard__token-color" />
                            <span className="index-dashboard__token-name">Others</span>
                          </div>
                        )}
                      </div>
                      <div className="index-dashboard__composition">
                        {index.tokens &&
                          index.tokens.slice(0, 3).map((token, i) => (
                            <React.Fragment key={nextId()}>
                              {+token.current_weight > 0 && (
                                <div
                                  className={`index-dashboard__token-percent ${colorsClassNames[i]}`}
                                  style={{
                                    width: `${new BigNumber(token.current_weight)
                                      .multipliedBy(100)
                                      .toString()}%`,
                                  }}
                                >
                                  {new BigNumber(token.current_weight).multipliedBy(100).toString()}
                                  %
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        {index.tokens.length > 3 && (
                          <div
                            className="index-dashboard__token-percent"
                            style={{
                              width: `${calculateOthersWeight(index)
                                .multipliedBy(100)
                                .toString()}%`,
                            }}
                          >
                            {calculateOthersWeight(index).multipliedBy(100).toString()}%
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            !loading && (
              <div className="no-indexes">
                <p className="no-indexes__text text-gradient">There is no indexes yet</p>
              </div>
            )
          )}
        </div>
      </div>
      <div className="index-dashboard__small">
        {indexes && indexes.map((index) => <IndexSmallCard key={nextId()} {...index} />)}
      </div>
    </section>
  );
};

export default Dashboard;
