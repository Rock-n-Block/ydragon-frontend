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
export const purposeCardsData: Array<ICard> = [
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
  },
  {
    name: 'David',
    emoji: '😌',
    isAnim: true,
    animData: DavidDiversifAnim,
    description: `David also has 5 fields, but has planted a different crop in each one.`,
  },
];

// Harvest component
export const harvestData: Array<IWheats> = [
  {
    name: 'John',
    emoji: '😭',
    animData: JhonAnim,
    isAnim: true,
  },
  {
    name: 'David',
    emoji: '😎',
    animData: DavidAnim,
    isAnim: true,
  },
];
