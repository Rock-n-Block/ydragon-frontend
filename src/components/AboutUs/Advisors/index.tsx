import React from 'react';

import nick from '../../../assets/img/about-us/advisors/nick.png';
import geralt from '../../../assets/img/about-us/advisors/geralt.png';
import eric from '../../../assets/img/about-us/advisors/eric.png';
import markus from '../../../assets/img/about-us/advisors/markus.png';

import iconLinkedIn from '../../../assets/img/icons/icon-linkedin.svg';
import iconTwitter from '../../../assets/img/icons/icon-twitter.svg';

import './Advisors.scss';

interface IEmployee {
  name: string;
  role?: string;
  img: string;
  linkedIn?: string;
  twitter?: string;
}

const Advisors: React.FC = () => {
  const team: Array<IEmployee> = [
    {
      name: 'Nick Ravanbakhsh',
      role: 'Founder at Base Protocol',
      img: nick,
      linkedIn: 'https://www.linkedin.com/in/nick-ravanbakhsh-801896114/',
    },
    {
      name: 'Geralt',
      role: 'CEO at CyberFi',
      img: geralt,
      twitter: 'https://twitter.com/geraltceo',
    },
    {
      name: 'Eric Kang',
      role: 'Senior BD Associate at Ava Labs',
      img: eric,
      linkedIn: 'https://www.linkedin.com/in/ericxkang/',
    },
    {
      name: 'Markus Jun',
      role: 'Founder at ICON Hyperconnect',
      img: markus,
      linkedIn: 'https://www.linkedin.com/in/markusjun/',
    },
  ];

  return (
    <section className="section teams">
      <div className="teams__title-wrapper">
        <h1 className="teams__title text-outline">Advisors</h1>
      </div>
      <div className="teams__items">
        {team.map((employee: IEmployee) => (
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
