import WheatBImg from '../../assets/img/simplified/diversify/wheatB.svg';
import WheatGImg from '../../assets/img/simplified/diversify/wheatG.svg';
// Harvest component images
import WheatNotImg from '../../assets/img/simplified/diversify/wheatNoProfit.svg';
import WheatPImg from '../../assets/img/simplified/diversify/wheatP.svg';
import WheatRImg from '../../assets/img/simplified/diversify/wheatR.svg';
// diversify and harvest images
import WheatImg from '../../assets/img/simplified/diversify/wheatY.svg';
import IncreaseIcon from '../../assets/img/simplified/purpose/increase.svg';
// images
import ReduceIcon from '../../assets/img/simplified/purpose/reduce.svg';
import { ICard, IWheats } from '../../types/components/simplifiedTypes';

import DavidAnim from '../../assets/json-anim/simplified-bad-harvest-david.json';
import DavidDiversifAnim from '../../assets/json-anim/simplified-diversif-david.json';

import JhonAnim from '../../assets/json-anim/simplified-bad-harvest-jhon.json';
import JhonDiversifAnim from '../../assets/json-anim/simplified-diversif-jhon.json';

import graphAnim from '../../assets/json-anim/simplified-graph.json';
import indexImg from '../../assets/json-anim/simplified-egg-index.json';

// Card component
export const cardData: Array<ICard> = [
  {
    title: 'Reduce risks',
    icon: ReduceIcon,
    img: indexImg,
    description: `The difference here is that you invest in several coins at once. Such a group is called an index - it's safer this way, below we will explain why.`,
  },
  {
    title: 'Increase income',
    icon: IncreaseIcon,
    img: graphAnim,
    description: `The coins in your index have value, with each offering opportunities to receive passive income - money earned without working!`,
  },
];

// Diversify component
export const diversifysData: Array<IWheats> = [
  {
    name: 'John',
    emoji: '🤔',
    isAnim: true,
    animData: JhonDiversifAnim,
    description: `John has five fields, and plants five fields of wheat. He has not diversified his portfolio.`,
    wheat: [
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg,
      },
    ],
  },
  {
    name: 'David',
    emoji: '😌',
    isAnim: true,
    animData: DavidDiversifAnim,
    description: `David also has 5 fields, but has planted a different crop in each one.`,
    wheat: [
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatBImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatRImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatPImg,
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatGImg,
      },
    ],
  },
];

// Harvest component
export const harvestData: Array<IWheats> = [
  {
    name: 'John',
    emoji: '😭',
    wheat: [
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg,
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg,
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg,
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg,
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg,
      },
    ],
    animData: JhonAnim,
    isAnim: true,
  },
  {
    name: 'David',
    emoji: '😎',
    animData: DavidAnim,
    wheat: [
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg,
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatBImg,
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatRImg,
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatPImg,
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatGImg,
      },
    ],
    isAnim: true,
  },
];
