import React, { useCallback, useEffect, useState } from 'react';
import nextId from 'react-id-generator';
import { Link } from 'react-router-dom';
import BigNumber from 'bignumber.js/bignumber';

import logo from '../../assets/img/icons/logo.svg';
import spinner from '../../assets/img/icons/spinner.svg';
import { IIndex } from '../../pages/Admin';
import { indexesApi } from '../../services/api';
import IndexSmallCard from './SmallCard/index';

import './Dashboard.scss';

export interface IUserIndex extends IIndex {
  day: number;
  week: number;
  month: number;
  total: number;
}

const Dashboard: React.FC = () => {
  const [indexes, setIndexes] = useState<Array<IUserIndex>>();
  const [loading, setLoading] = useState<boolean>(false);

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

  useEffect(() => {
    getIndexes();
  }, [getIndexes]);

  console.log(indexes);
  return (
    <section className="section section--admin">
      <h2 className="section__title text-outline">Indexes</h2>
      <div className="index-dashboard__big">
        <div className="index-dashboard">
          <div className="index-dashboard__row index-dashboard__row--head">
            <div className="index-dashboard__col">
              {/* <div className="index-dashboard__sort index-dashboard__sort--up">Name</div> */}
            </div>
            <div className="index-dashboard__col">
              <div className="index-dashboard__sort">Market cap</div>
            </div>
            <div className="index-dashboard__col">
              <div className="index-dashboard__sort">Price</div>
            </div>
            <div className="index-dashboard__col">
              <div className="index-dashboard__sort">1 Day</div>
            </div>
            <div className="index-dashboard__col">
              <div className="index-dashboard__sort">1 month</div>
            </div>
            <div className="index-dashboard__col">
              <div className="index-dashboard__sort">3 month</div>
            </div>
            <div className="index-dashboard__col">
              <div className="index-dashboard__sort">Since Inception</div>
            </div>
          </div>

          <div className="index-dashboard__content">
            {loading ? (
              <div className="spinner">
                <img alt="" src={spinner} width="50" height="50" />
              </div>
            ) : (
              indexes?.map((index: IUserIndex) => (
                <div className="index-dashboard__item" key={nextId()}>
                  <div className="index-dashboard__row">
                    <Link to={`/index/${index.id}`} className="index-dashboard__col">
                      <div className="index-dashboard__info">
                        <img
                          src={logo}
                          alt=""
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
                          <div className="index-dashboard__token">
                            <span
                              className={`index-dashboard__token-color ${colorsClassNames[i]}`}
                            />
                            <span className="index-dashboard__token-name">{token.symbol}</span>
                          </div>
                        ))}

                      {index.tokens.length > 3 && (
                        <div className="index-dashboard__token">
                          <span
                            className="index-dashboard__token-color"
                            style={{ backgroundColor: '#FFFFFF' }}
                          />
                          <span className="index-dashboard__token-name">Others</span>
                        </div>
                      )}
                    </div>
                    <div className="index-dashboard__composition">
                      {index.tokens &&
                        index.tokens.slice(0, 3).map((token, i) => (
                          <>
                            {+token.current_weight > 0 && (
                              <div
                                className={`index-dashboard__token-percent ${colorsClassNames[i]}`}
                                style={{
                                  width: `${new BigNumber(token.current_weight)
                                    .multipliedBy(100)
                                    .toString()}%`,
                                }}
                              >
                                {new BigNumber(token.current_weight).multipliedBy(100).toString()}%
                              </div>
                            )}
                          </>
                        ))}
                      {index.tokens.length > 3 && (
                        <div
                          className="index-dashboard__token-percent"
                          style={{
                            width: `${calculateOthersWeight(index).multipliedBy(100).toString()}%`,
                          }}
                        >
                          {calculateOthersWeight(index).multipliedBy(100).toString()}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="index-dashboard__small">
        {indexes && indexes.map((index) => <IndexSmallCard {...index} />)}
      </div>
    </section>
  );
};

export default Dashboard;
