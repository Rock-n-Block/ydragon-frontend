import React, { useCallback, useEffect, useState } from 'react';

import logo from '../../assets/img/icons/logo.svg';

import './Dashboard.scss';
import { IAdminIndex } from '../../pages/Admin';
import {Link} from 'react-router-dom';
import { indexesApi } from '../../services/api';
import nextId from 'react-id-generator';
import BigNumber from 'bignumber.js/bignumber';

const Dashboard: React.FC = () => {
  const [indexes, setIndexes] = useState<Array<IAdminIndex>>();

  const calculateOthersWeight=(index:IAdminIndex)=>{
    const othersArray=index.tokens?.slice(3);
    let sum=new BigNumber(0);
    othersArray?.forEach((element)=>{
      sum=sum.plus(new BigNumber(element.current_weight));
    });
    return sum;
  };

  const getIndexes = useCallback(() => {
    indexesApi.getIndexes().then(({ data }) => {
      setIndexes(data);
    }).catch((error) => {
      const { response } = error;
      console.log('get indexes error', response);
    });
  }, []);
  useEffect(() => {
    getIndexes();
  }, [getIndexes]);
  return (
    <section className='section section--admin'>
      <h2 className='section__title text-outline'>Indexes</h2>

      <div className='index-dashboard'>
        <div className='index-dashboard__row index-dashboard__row--head'>
          <div className='index-dashboard__col'>
            <div className='index-dashboard__sort index-dashboard__sort--up'>Name</div>
          </div>
          <div className='index-dashboard__col'>
            <div className='index-dashboard__sort'>Market cap</div>
          </div>
          <div className='index-dashboard__col'>
            <div className='index-dashboard__sort'>Price</div>
          </div>
          <div className='index-dashboard__col'>
            <div className='index-dashboard__sort'>1 Day</div>
          </div>
          <div className='index-dashboard__col'>
            <div className='index-dashboard__sort'>1 month</div>
          </div>
          <div className='index-dashboard__col'>
            <div className='index-dashboard__sort'>3 month</div>
          </div>
          <div className='index-dashboard__col'>
            <div className='index-dashboard__sort'>Since Inception</div>
          </div>
        </div>

        <div className='index-dashboard__content'>
          {indexes?.map((index: IAdminIndex) => (
            <div className='index-dashboard__item' key={nextId()}>
              <div className='index-dashboard__row'>
                <Link to={`/index/${index.id}`} className='index-dashboard__col'>
                  <div className='index-dashboard__info'>
                    <img src={logo} alt='' width='31' height='28' className='index-dashboard__icon' />

                    <div className='index-dashboard__name'>{index.name}</div>
                  </div>
                </Link>
                <div className='index-dashboard__col'>
                  <div className='index-dashboard__market-cup'>$34.02525</div>
                </div>
                <div className='index-dashboard__col'>
                  <div className='index-dashboard__price'>$375</div>
                </div>
                <div className='index-dashboard__col'>
                  <div className='index-dashboard__percent index-dashboard__percent--up'>+1.7%</div>
                </div>
                <div className='index-dashboard__col'>
                  <div className='index-dashboard__percent index-dashboard__percent--up'>+11.7%</div>
                </div>
                <div className='index-dashboard__col'>
                  <div className='index-dashboard__percent index-dashboard__percent--up'>+167.7%</div>
                </div>
                <div className='index-dashboard__col'>
                  <div className='index-dashboard__percent index-dashboard__percent--up'>+514.8%</div>
                </div>

                <div className='index-dashboard__tokens'>
                  <div className='index-dashboard__token'>
                  <span
                    className='index-dashboard__token-color'
                    style={{ backgroundColor: '#F7931E' }}
                  />
                    <span className='index-dashboard__token-name'>{index.tokens?index.tokens[0].name:''}</span>
                  </div>
                  {index.tokens&&index.tokens?.length>=2&&(<div className='index-dashboard__token'>
                  <span
                    className='index-dashboard__token-color'
                    style={{ backgroundColor: '#2754CD' }}
                  />
                    <span className='index-dashboard__token-name'>{index.tokens[1].name}</span>
                  </div>)}
                  {index.tokens&&index.tokens?.length>=3&&(<div className='index-dashboard__token'>
                  <span
                    className='index-dashboard__token-color'
                    style={{ backgroundColor: '#D53038' }}
                  />
                    <span className='index-dashboard__token-name'>{index.tokens[2].name}</span>
                  </div>)}
                  {index.tokens&&index.tokens?.length===4&&(<div className='index-dashboard__token'>
                  <span
                    className='index-dashboard__token-color'
                    style={{ backgroundColor: '#000316' }}
                  />
                    <span className='index-dashboard__token-name'>{index.tokens[3].name}</span>
                  </div>)}
                  {index.tokens&&index.tokens?.length>4&&(<div className='index-dashboard__token'>
                  <span
                    className='index-dashboard__token-color'
                    style={{ backgroundColor: '#000316' }}
                  />
                    <span className='index-dashboard__token-name'>Others</span>
                  </div>)}
                </div>

                <div className='index-dashboard__composition'>
                  <div
                    className='index-dashboard__token-percent'
                    style={{ width: `${index.tokens?new BigNumber(index.tokens[0].current_weight).multipliedBy(100).toString():''}%`, borderColor: '#F7931E' }}
                  >
                    {index.tokens?new BigNumber(index.tokens[0].current_weight).multipliedBy(100).toString():''}%
                  </div>
                  {index.tokens&&index.tokens?.length>=2&&(<div
                    className='index-dashboard__token-percent'
                    style={{ width: `${new BigNumber(index.tokens[1].current_weight).multipliedBy(100).toString()}%`, borderColor: '#2754CD' }}
                  >
                    {new BigNumber(index.tokens[1].current_weight).multipliedBy(100).toString()}%
                  </div>)}
                  {index.tokens&&index.tokens?.length>=3&&(<div
                    className='index-dashboard__token-percent'
                    style={{ width: `${new BigNumber(index.tokens[2].current_weight).multipliedBy(100).toString()}%`, borderColor: '#D53038' }}
                  >
                    {new BigNumber(index.tokens[2].current_weight).multipliedBy(100).toString()}%
                  </div>)}
                  {index.tokens&&index.tokens?.length===4&&(<div
                    className='index-dashboard__token-percent'
                    style={{ width: `${new BigNumber(index.tokens[3].current_weight).multipliedBy(100).toString()}%`, borderColor: '#000316' }}
                  >
                    {new BigNumber(index.tokens[3].current_weight).multipliedBy(100).toString()}%
                  </div>)}
                  {index.tokens&&index.tokens?.length>4&&(<div
                    className='index-dashboard__token-percent'
                    style={{ width: `${calculateOthersWeight(index).multipliedBy(100).toString()}%`, borderColor: '#000316' }}
                  >
                    {calculateOthersWeight(index).multipliedBy(100).toString()}%
                  </div>)}
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
