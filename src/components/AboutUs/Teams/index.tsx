import React from 'react';

import iconHalfDan from '../../../assets/img/about-us/team/halfdan.png';
import iconLeon from '../../../assets/img/about-us/team/leon.png';
import iconOctal from '../../../assets/img/about-us/team/octal.png';
import iconRaiden from '../../../assets/img/about-us/team/raiden.png';
import iconJayWheeler from '../../../assets/img/about-us/team/jay-wheeler.png';
import iconOliverMills from '../../../assets/img/about-us/team/oliver-mills.png';
import iconSiciliaCirrus from '../../../assets/img/about-us/team/sicilia-cirrus.png';
import iconLinkedIn from '../../../assets/img/icons/icon-linkedin.svg';

import './Teams.scss';

interface IEmployee {
  name: string;
  role?: string;
  img: string;
  description: string;
  link?: string;
}

const Teams: React.FC = () => {
  const team: Array<IEmployee> = [
    {
      name: 'Raiden - CEO',
      img: iconRaiden,
      description:
        'Core library contributor at a multi-billion dollar blockchain juggernaut, Big Data analyst ' +
        'for a secondary market platform, ex-founder and CEO of an ambitious tech startup and back-to-back' +
        ' high performance computing hackathon winner. Has a propensity for using specialized algorithms' +
        ' and data analysis to solve complex problems.',
    },
    {
      name: 'OCTAL - COO',
      img: iconOctal,
      description:
        'Developed complex backend systems for one of the largest investment banks in the' +
        ' world, led multi-million dollar software projects to fruition in the electronic' +
        ' payments sector, previously CTO of a sentiment-driven investment platform project,' +
        ' in addition to having participated in doctoral graph theoretical work.',
    },
    {
      name: 'Leon - CMO',
      img: iconLeon,
      description:
        'Results driven IT project manager with experience delivering high value consulting' +
        ' projects focused on bespoke solution building. Skilled in building customer' +
        ' relationships up to C level and delivering multiple agile projects simultaneously.' +
        ' Currently delivering large scale solutions for an award winning cryptocurrency' +
        ' liquidity provider.',
    },
    {
      name: 'HalfDan - CBDO',
      img: iconHalfDan,
      description:
        'Sales and marketing expert for top IT companies for almost 8 years. Adept in leading' +
        ' startup projects to success and developing their market all around the world. Former' +
        ' Co-Founder and COO of an early stage blockchain project where he managed a team.',
    },
    {
      name: 'Jay Wheeler',
      role: 'Marketing Manager',
      img: iconJayWheeler,
      description:
        "Crypto veteran that's been in the game since 2012, with extensive community and marketing" +
        ' management experience having held this role within several crypto startups. A high level' +
        ' technical and fundamental analyst, and has used this experience and knowledge to play a' +
        ' crucial role in creating multiple profitable marketing and trading strategies.',
      link: 'https://www.linkedin.com/in/jamie-wheeler1988/',
    },
    {
      name: 'Oliver Mills',
      role: 'Content Manager',
      img: iconOliverMills,
      description:
        'Seasoned writer and content creator, with a wealth of experience across multiple fields. Five years of DeFi experience from multiple standpoints, including trading, technical analysis, content creation and educational article writing. Previously Senior Writer and Course Content Creator for a promising crypto educational start-up.',
      link: 'https://www.linkedin.com/in/oliver-s-mills1984/',
    },
    {
      name: 'Sicilia Cirrus',
      role: 'Digital Marketing Associate',
      img: iconSiciliaCirrus,
      description:
        'Marketing communication expert with a demonstrated history of working in technology, events, and multinational companies. Currently, involved with blockchain and refining things that involve creativity, communication, and adequate strategies, deploying campaigns for startups to the corporate level worldwide.',
      link: 'https://www.linkedin.com/in/sicilia-cirrus-8b708126/',
    },
  ];

  return (
    <section className="section teams">
      <div className="teams__title-wrapper">
        <h1 className="teams__title text-outline">TEAM</h1>
      </div>
      <div className="teams__items">
        {team.map((employee: IEmployee) => (
          <div className="team">
            <div className="team__img--wrapper">
              <img
                alt={employee.name}
                className="team__img"
                src={employee.img}
                width="64"
                height="64"
              />
            </div>
            <div className="team__info">
              <span className="team__info--title">
                {employee.name}
                {employee.link ? (
                  <a
                    className="team__info--link"
                    href={employee.link}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <img alt="linkedIn" src={iconLinkedIn} width={27} height={27} />
                  </a>
                ) : (
                  <></>
                )}
              </span>
              {employee.role ? <span className="team__info--role">{employee.role}</span> : <></>}
              <span className="team__info--text">{employee.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Teams;
