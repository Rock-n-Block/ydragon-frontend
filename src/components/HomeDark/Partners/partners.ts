import bscPadLD from '../../../assets/img/icons/partners/bsc-pad.svg';
import hyperconnectD from '../../../assets/img/icons/partners/hyperconnect-dark.svg';
import hyperconnectL from '../../../assets/img/icons/partners/hyperconnect-light.svg';
import lossLessD from '../../../assets/img/icons/partners/lossless-dark.svg';
import lossLessL from '../../../assets/img/icons/partners/lossless-light.svg';
import marshlandD from '../../../assets/img/icons/partners/marshland-dark.png';
import marshlandL from '../../../assets/img/icons/partners/marshland-light.png';
import moonwolfD from '../../../assets/img/icons/partners/moonwolf-dark.png';
import moonwolfL from '../../../assets/img/icons/partners/moonwolf-light.png';
import bscStationL from '../../../assets/img/icons/partners/bsc-station-light.png';
import bscStationD from '../../../assets/img/icons/partners/bsc-station-dark.png';
import polygonD from '../../../assets/img/icons/partners/polygon-dark.svg';
import polygonL from '../../../assets/img/icons/partners/polygon-light.svg';
import qiDaoD from '../../../assets/img/icons/partners/qi-dao-dark.png';
import widilandLD from '../../../assets/img/icons/partners/widiland.png';
import realmD from '../../../assets/img/icons/partners/realm-dark.png';
import realmL from '../../../assets/img/icons/partners/realm-light.png';
import qiDaoL from '../../../assets/img/icons/partners/qi-dao-light.png';
import trustSwapD from '../../../assets/img/icons/partners/trust-swap-dark.svg';
import unimexD from '../../../assets/img/icons/partners/unimex-light.svg';
import unimexL from '../../../assets/img/icons/partners/unimex-dark.svg';
import trustSwapL from '../../../assets/img/icons/partners/trust-swap-light.svg';
import cyberfiL from '../../../assets/img/icons/partners/cyberfi-dark.svg';
import cyberfiD from '../../../assets/img/icons/partners/cyberfi-light.svg';
import apeswapLD from '../../../assets/img/icons/partners/apeswap-dark.svg';
import certikD from '../../../assets/img/icons/partners/certik-dark.png';
import certikL from '../../../assets/img/icons/partners/certik-light.png';
import chainGamesD from '../../../assets/img/icons/partners/chaingames-dark.png';
import chainGamesL from '../../../assets/img/icons/partners/chaingames-light.png';
import oneringD from '../../../assets/img/icons/partners/onering-dark.png';
import oneringL from '../../../assets/img/icons/partners/onering-light.png';
import snowballD from '../../../assets/img/icons/partners/snowball-dark.png';
import snowballL from '../../../assets/img/icons/partners/snowball-light.png';
import penguinfinanceLD from '../../../assets/img/icons/partners/penguinfinance.png';
import pangolinLD from '../../../assets/img/icons/partners/pangolin.png';
import axialLD from '../../../assets/img/icons/partners/axial.png';
import unipilotLD from '../../../assets/img/icons/partners/unipilot.png';
import avalabsD from '../../../assets/img/icons/partners/avalabs-dark.png';
import avalabsL from '../../../assets/img/icons/partners/avalabs-light.png';
import baseProtocolLD from '../../../assets/img/icons/partners/baseprotocol.png';

export const partnersSetArray = <const>[
  'Binance Smart Chain',
  'Multichain',
  'Avalanche',
  'Ethereum',
  'Polygon',
  'Advisors / Investors / Other',
];
export type TPartnerSet = typeof partnersSetArray[number];
// export type TPartnerSet =
//   | 'Binance Smart Chain'
//   | 'Multichain'
//   | 'Avalanche'
//   | 'Ethereum'
//   | 'Polygon'
//   | 'Advisors / Investors / Other';

interface IPartner {
  name: string;
  image: {
    light: string;
    dark: string;
  };
  link: string;
  width: number;
  height: number;
}

export const partners: Record<TPartnerSet, IPartner[]> = {
  'Binance Smart Chain': [
    {
      name: 'bscpad',
      image: {
        light: bscPadLD,
        dark: bscPadLD,
      },
      link: 'https://bscpad.com/',
      width: 152,
      height: 64,
    },
    {
      name: 'ape swap',
      image: {
        light: apeswapLD,
        dark: apeswapLD,
      },
      link: 'https://apeswap.finance/',
      width: 315,
      height: 84,
    },
    {
      name: 'widiland',
      image: {
        light: widilandLD,
        dark: widilandLD,
      },
      link: 'https://widiland.com/',
      width: 274,
      height: 96,
    },
    {
      name: 'bscstation',
      image: {
        light: bscStationL,
        dark: bscStationD,
      },
      link: 'https://bscstation.finance/#/Dashboard',
      width: 186,
      height: 72,
    },
  ],
  'Multichain': [
    {
      name: 'realm',
      image: {
        light: realmL,
        dark: realmD,
      },
      link: 'https://www.realm.art/',
      width: 162,
      height: 45,
    },
    {
      name: 'chaingames',
      image: {
        light: chainGamesL,
        dark: chainGamesD,
      },
      link: 'https://chaingames.io/',
      width: 393,
      height: 62,
    },
    {
      name: 'onering',
      image: {
        light: oneringL,
        dark: oneringD,
      },
      link: 'https://www.onering.finance/',
      width: 287,
      height: 66,
    },
    {
      name: 'cyberfi',
      image: {
        light: cyberfiL,
        dark: cyberfiD,
      },
      link: 'https://cyberfi.tech/',
      width: 262,
      height: 72,
    },
  ],
  'Avalanche': [
    {
      name: 'snowball',
      image: {
        light: snowballL,
        dark: snowballD,
      },
      link: 'https://www.snowball.network/',
      width: 178,
      height: 43,
    },
    {
      name: 'penguinfinance',
      image: {
        light: penguinfinanceLD,
        dark: penguinfinanceLD,
      },
      link: 'https://penguinfinance.org/',
      width: 379,
      height: 89,
    },
    {
      name: 'pangolin',
      image: {
        light: pangolinLD,
        dark: pangolinLD,
      },
      link: 'https://pangolin.exchange/',
      width: 274,
      height: 79,
    },
    {
      name: 'axial',
      image: {
        light: axialLD,
        dark: axialLD,
      },
      link: 'https://www.axial.exchange/',
      width: 186,
      height: 82,
    },
  ],
  'Ethereum': [
    {
      name: 'lossless',
      image: {
        light: lossLessL,
        dark: lossLessD,
      },
      link: 'https://lossless.cash/',
      width: 245,
      height: 54,
    },
    {
      name: 'trustswap',
      image: {
        light: trustSwapL,
        dark: trustSwapD,
      },
      link: 'https://trustswap.com/',
      width: 276,
      height: 46,
    },
    {
      name: 'unipilot',
      image: {
        light: unipilotLD,
        dark: unipilotLD,
      },
      link: 'https://unipilot.io/',
      width: 336,
      height: 48,
    },
    {
      name: 'unimex',
      image: {
        light: unimexL,
        dark: unimexD,
      },
      link: 'https://unimex.network/',
      width: 239,
      height: 64,
    },
  ],
  'Polygon': [
    {
      name: 'moonwolf',
      image: {
        light: moonwolfL,
        dark: moonwolfD,
      },
      link: 'https://moonwolf.io/',
      width: 275,
      height: 72,
    },
    {
      name: 'qi dao',
      image: {
        light: qiDaoL,
        dark: qiDaoD,
      },
      link: 'https://app.mai.finance/',
      width: 160,
      height: 72,
    },
    {
      name: 'polygon',
      image: {
        light: polygonL,
        dark: polygonD,
      },
      link: 'https://polygon.technology/',
      width: 235,
      height: 52,
    },
  ],
  'Advisors / Investors / Other': [
    {
      name: 'avalabs',
      image: {
        light: avalabsL,
        dark: avalabsD,
      },
      link: 'https://www.avalabs.org/',
      width: 137,
      height: 78,
    },
    {
      name: 'marshland',
      image: {
        light: marshlandL,
        dark: marshlandD,
      },
      link: 'https://www.marshlandcapital.com/',
      width: 90,
      height: 77,
    },
    {
      name: 'baseprotocol',
      image: {
        light: baseProtocolLD,
        dark: baseProtocolLD,
      },
      link: 'https://www.baseprotocol.org/',
      width: 92,
      height: 111,
    },
    {
      name: 'certik',
      image: {
        light: certikL,
        dark: certikD,
      },
      link: 'https://www.certik.com/',
      width: 311,
      height: 73,
    },
    {
      name: 'icon hyperconnect',
      image: {
        light: hyperconnectL,
        dark: hyperconnectD,
      },
      link: 'https://hyperconnect.com/ko/',
      width: 290,
      height: 64,
    },
    {
      name: 'unimex',
      image: {
        light: unimexL,
        dark: unimexD,
      },
      link: 'https://unimex.network/',
      width: 239,
      height: 64,
    },
  ],
};
