import React from 'react';

import logo from '../../../assets/img/icons/logo.svg';
import { GradientText } from '../../index';

import './Dashboard.scss';

const Dashboard: React.FC = () => {
  return (
    <section className="section section--admin">
      <h2 className="section__title">
        <GradientText width="652" height="38" text="Index" />
      </h2>

      <div className="index-dashboard">
        <div className="index-dashboard__row index-dashboard__row--head">
          <div className="index-dashboard__col">
            <div className="index-dashboard__sort index-dashboard__sort--up">Name</div>
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
          <div className="index-dashboard__item">
            <div className="index-dashboard__row">
              <div className="index-dashboard__col">
                <div className="index-dashboard__info">
                  <img src={logo} alt="" width="31" height="28" className="index-dashboard__icon" />

                  <div className="index-dashboard__name">ETH BT FarmST</div>
                </div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__market-cup">$34.02525</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__price">$375</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+1.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+11.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+167.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+514.8%</div>
              </div>

              <div className="index-dashboard__tokens">
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#F7931E' }}
                  />
                  <span className="index-dashboard__token-name">BTC</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#2754CD' }}
                  />
                  <span className="index-dashboard__token-name">ETH</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#D53038' }}
                  />
                  <span className="index-dashboard__token-name">BNB</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#000316' }}
                  />
                  <span className="index-dashboard__token-name">EOS</span>
                </div>
              </div>

              <div className="index-dashboard__composition">
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '55%', borderColor: '#F7931E' }}
                >
                  55%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '22%', borderColor: '#2754CD' }}
                >
                  22%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '17%', borderColor: '#D53038' }}
                >
                  17%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '6%', borderColor: '#000316' }}
                >
                  6%
                </div>
              </div>
            </div>
          </div>

          <div className="index-dashboard__item">
            <div className="index-dashboard__row">
              <div className="index-dashboard__col">
                <div className="index-dashboard__info">
                  <img src={logo} alt="" width="31" height="28" className="index-dashboard__icon" />

                  <div className="index-dashboard__name">ETH BT FarmST</div>
                </div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__market-cup">$34.02525</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__price">$375</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+1.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+11.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+167.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+514.8%</div>
              </div>

              <div className="index-dashboard__tokens">
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#F7931E' }}
                  />
                  <span className="index-dashboard__token-name">BTC</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#2754CD' }}
                  />
                  <span className="index-dashboard__token-name">ETH</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#D53038' }}
                  />
                  <span className="index-dashboard__token-name">BNB</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#000316' }}
                  />
                  <span className="index-dashboard__token-name">EOS</span>
                </div>
              </div>

              <div className="index-dashboard__composition">
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '55%', borderColor: '#F7931E' }}
                >
                  55%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '22%', borderColor: '#2754CD' }}
                >
                  22%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '17%', borderColor: '#D53038' }}
                >
                  17%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '6%', borderColor: '#000316' }}
                >
                  6%
                </div>
              </div>
            </div>
          </div>

          <div className="index-dashboard__item">
            <div className="index-dashboard__row">
              <div className="index-dashboard__col">
                <div className="index-dashboard__info">
                  <img src={logo} alt="" width="31" height="28" className="index-dashboard__icon" />

                  <div className="index-dashboard__name">ETH BT FarmST</div>
                </div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__market-cup">$34.02525</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__price">$375</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+1.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+11.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+167.7%</div>
              </div>
              <div className="index-dashboard__col">
                <div className="index-dashboard__percent index-dashboard__percent--up">+514.8%</div>
              </div>

              <div className="index-dashboard__tokens">
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#F7931E' }}
                  />
                  <span className="index-dashboard__token-name">BTC</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#2754CD' }}
                  />
                  <span className="index-dashboard__token-name">ETH</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#D53038' }}
                  />
                  <span className="index-dashboard__token-name">BNB</span>
                </div>
                <div className="index-dashboard__token">
                  <span
                    className="index-dashboard__token-color"
                    style={{ backgroundColor: '#000316' }}
                  />
                  <span className="index-dashboard__token-name">EOS</span>
                </div>
              </div>

              <div className="index-dashboard__composition">
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '55%', borderColor: '#F7931E' }}
                >
                  55%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '22%', borderColor: '#2754CD' }}
                >
                  22%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '17%', borderColor: '#D53038' }}
                >
                  17%
                </div>
                <div
                  className="index-dashboard__token-percent"
                  style={{ width: '6%', borderColor: '#000316' }}
                >
                  6%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
