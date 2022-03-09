import React from 'react';

import halfdan from '../../../assets/img/about-us/team/halfdan.png';
import jay from '../../../assets/img/about-us/team/jay.png';
import leon from '../../../assets/img/about-us/team/leon.png';
import mujtaba from '../../../assets/img/about-us/team/mujtaba.png';
import octal from '../../../assets/img/about-us/team/octal.png';
import oliver from '../../../assets/img/about-us/team/oliver.png';
import raiden from '../../../assets/img/about-us/team/raiden.png';
import sicilia from '../../../assets/img/about-us/team/sicilia.png';
import stephanie from '../../../assets/img/about-us/team/stephanie.png';
import iconLinkedIn from '../../../assets/img/icons/icon-linkedin.svg';
import iconTwitter from '../../../assets/img/icons/icon-twitter.svg';

import './Teams.scss';

interface IEmployee {
  name: string;
  role?: string;
  img: string;
  description: string;
  linkedIn?: string;
  twitter?: string;
}

const Teams: React.FC = () => {
  const team: Array<IEmployee> = [
    {
      name: 'Raiden',
      role: 'Chief Executive Officer',
      img: raiden,
      description:
        'Core library contributor at a multi-billion dollar blockchain juggernaut, Big Data analyst for a secondary market platform, ex-founder and CEO of an ambitious tech startup and back-to-back high performance computing hackathon winner. Has a propensity for using specialized algorithms and data analysis to solve complex problems.',
      twitter: 'https://twitter.com/RaidenRed_',
    },
    {
      name: 'OCTAL',
      role: 'Chief Operating Officer',
      img: octal,
      description:
        'Developed complex backend systems for one of the largest investment banks in the world, led multi-million dollar software projects to fruition in the electronic payments sector, previously CTO of a sentiment-driven investment platform project, in addition to having participated in doctoral graph theoretical work.',
      twitter: 'https://twitter.com/O_C_T_A_L',
    },
    {
      name: 'Jay Wheeler',
      role: 'Chief Marketing Officer',
      img: jay,
      description:
        "Crypto veteran that's been in the game since 2012, with extensive community and marketing management experience having held this role within several crypto startups. A high level technical and fundamental analyst, and has used this experience and knowledge to play a crucial role in creating multiple profitable marketing strategies.",
      linkedIn: 'https://www.linkedin.com/in/jamie-wheeler1988/',
    },
    {
      name: 'Mujtaba Arbi',
      role: 'Chief Innovation Officer',
      img: mujtaba,
      description:
        '4 years in Development and Management. 3 years in Blockchain. Previously Business Development Manager at CyberFi and Software Engineer Intern at Harmony Protocol. Repeating winner of many prestigious computing challenges. Plethora of knowledge in project development and Computer Scientist at heart.',
      linkedIn: 'https://www.linkedin.com/in/ghulame-mujtaba-arbi-6b5007170/',
    },
    {
      name: 'Leon',
      role: 'Chief Project Officer',
      img: leon,
      description:
        'Results driven IT project manager with experience delivering high value consulting projects focused on bespoke solution building. Skilled in building customer relationships up to C level and delivering multiple agile projects simultaneously. Currently delivering large scale solutions for an award winning cryptocurrency liquidity provider.',
      twitter: 'https://twitter.com/_LeonK',
    },
    {
      name: 'HalfDan',
      role: 'Chief Business Development Officer',
      img: halfdan,
      description:
        'Sales and marketing expert for top IT companies for almost 8 years. Adept in leading startup projects to success and developing their market all around the world. Former Co-Founder and COO of an early stage blockchain project where he managed a team.',
      twitter: 'https://twitter.com/Halfdan_YD',
    },
    {
      name: 'Oliver Mills',
      role: 'Chief Brand Officer',
      img: oliver,
      description:
        'Seasoned writer and content creator, with a wealth of experience across multiple fields. Five years of DeFi experience from multiple standpoints, including trading, technical analysis, content creation and educational article writing. Previously Senior Writer and Course Content Creator for a promising crypto educational start-up.',
      linkedIn: 'https://www.linkedin.com/in/oliver-s-mills1984/',
    },
    {
      name: 'Stephanie Simon',
      role: 'Head of People',
      img: stephanie,
      description:
        "Operations professional who's on a mission to help projects in the DeFi space disrupt the old world order.Harnesses the strengths and talents of teams, recruiting A-Players, optimizing workflows with cutting edge methodologies to make them more effective and employing a servant-style leadership/people-first culture.",
      linkedIn: 'https://www.linkedin.com/in/stephaniensimon/',
    },
    {
      name: 'Sicilia Cirrus',
      role: 'Digital Marketing Associate',
      img: sicilia,
      description:
        'Marketing communication expert with a demonstrated history of working in technology, events, and multinational companies. Currently, involved with blockchain and refining things that involve creativity, communication, and adequate strategies, deploying campaigns for startups to the corporate level worldwide.',
      linkedIn: 'https://www.linkedin.com/in/sicilia-cirrus-8b708126/',
    },
  ];

  return (
    <section className="teams" id="team">
      <div className="teams__title-wrapper">
        <h1 className="teams__title text-outline">TEAM</h1>
      </div>
      <div className="teams__items container">
        {team.map((employee: IEmployee) => (
          <div className="team" key={`team_${employee.name}`}>
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
              <span className="team__info--text">{employee.description}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Teams;
