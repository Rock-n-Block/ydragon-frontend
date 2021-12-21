// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import whitepaper from '../../assets/pdf/YD_WP.pdf';

export const aboutLinks = [
  { title: 'About Us', link: '/about-us#top' },
  { title: 'YDragon simplified', link: '/simplified' },
  { title: 'FAQ', link: '/about-us#FAQ' },
  { title: 'Whitepaper', link: whitepaper },
  { title: 'Contact us', link: 'mailto:info@ydragon.io' },
  // { title: 'Careers', link: '/about-us#team' },
];

export const productLinks = [
  { title: 'Index Products Beta', link: '/indexes', auth: ['login', 'notEth'] },
  // { title: 'IndexPad', link: '/simplified' },
  { title: 'StakePad', link: '/staking' },
  { title: 'Private Blockchain Funds', link: '/pbf' },
  { title: 'Bridge', link: 'https://bridge.ydragon.io/' },
];

export const mobileLinksData = [
  {
    title: 'Home',
    titleLink: '/',
  },
  {
    title: 'Products',
    links: [
      { title: 'Index Products Beta', link: '/indexes', auth: 'notEth' },
      { title: 'StakePad', link: '/staking' },
      { title: 'Private Blockchain Fund', link: '/pbf' },
      { title: 'Bridge', link: 'https://bridge.ydragon.io/' },
    ],
  },
  {
    title: 'About',
    links: [
      { title: 'About us', link: '/about-us#top' },
      { title: 'YDragon simplified', link: '/simplified' },
      { title: 'FAQ', link: '/about-us#FAQ' },
      { title: 'Whitepaper', link: whitepaper },
      { title: 'Contact us', link: 'mailto:info@ydragon.io' },
    ],
  },
  {
    title: 'Admin',
    titleLink: '/admin',
    auth: 'admin',
  },
];
