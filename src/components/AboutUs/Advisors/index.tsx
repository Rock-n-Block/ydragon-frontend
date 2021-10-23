import React from 'react';

import iconLinkedIn from '../../../assets/img/icons/icon-linkedin.svg';
import iconTwitter from '../../../assets/img/icons/icon-twitter.svg';
import { team } from './data';

const Advisors: React.FC = () => {
  return (
    <section className="section teams">
      <div className="teams__title-wrapper">
        <h1 className="teams__title text-outline">Advisors</h1>
      </div>
      <div className="teams__items">
        {team.map((employee) => (
          <div className="team">
            <div className="team__img--wrapper">
              <img alt={employee.name} className="team__img" src={employee.img} />
            </div>
            <div className="team__info">
              <span className="team__info--title">
                {employee.name}
                {employee.linkedIn || employee.twitter ? (
                  <a
                    className="team__info--link"
                    href={employee.linkedIn || employee.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img
                      alt="linkedIn"
                      src={employee.linkedIn ? iconLinkedIn : iconTwitter}
                      width={27}
                      height={27}
                    />
                  </a>
                ) : (
                  <></>
                )}
              </span>
              {employee.role ? <span className="team__info--role">{employee.role}</span> : <></>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Advisors;
