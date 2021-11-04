// import eric from '../../../assets/img/about-us/advisors/eric.png';
import farmtown from '../../../assets/img/about-us/advisors/farmtown.png';
import geralt from '../../../assets/img/about-us/advisors/geralt.png';
import mark from '../../../assets/img/about-us/advisors/mark.png';
import markus from '../../../assets/img/about-us/advisors/markus.png';
import nick from '../../../assets/img/about-us/advisors/nick.png';
import mattew from '../../../assets/img/about-us/advisors/mattew.jpg';
import david from '../../../assets/img/about-us/advisors/david.jpg';

interface IEmployee {
  name: string;
  role?: string;
  img: string;
  linkedIn?: string;
  twitter?: string;
}

export const team: Array<IEmployee> = [
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
  // {
  //   name: 'Eric Kang',
  //   role: 'Senior BD Associate at Ava Labs',
  //   img: eric,
  //   linkedIn: 'https://www.linkedin.com/in/ericxkang/',
  // },
  {
    name: 'Markus Jun',
    role: 'Founder at ICON Hyperconnect',
    img: markus,
    linkedIn: 'https://www.linkedin.com/in/markusjun/',
  },
  {
    name: 'Mark Stanwyck',
    role: 'Director at Avalaunch',
    img: mark,
    linkedIn: 'https://www.linkedin.com/in/mark-stanwyck-07a04bb/',
  },
  {
    name: 'farmtown',
    role: 'Founder at Unimex',
    img: farmtown,
    twitter: 'https://twitter.com/farmtownN',
  },
  {
    name: 'David Marshall',
    role: 'Founder at Marshland Digital Assets',
    img: david,
    linkedIn: 'https://www.linkedin.com/in/davidkmarshall/',
  },
  {
    name: 'Matthew Land',
    role: 'Founder at Marshland Digital Assets',
    img: mattew,
    linkedIn: 'https://www.linkedin.com/in/ohheymatty/',
  },
];
