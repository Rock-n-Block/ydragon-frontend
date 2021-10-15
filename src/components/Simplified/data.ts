import { ICard, IWheats } from '../../types/components/simplifiedTypes';
// images
import ReduceIcon from '../../assets/img/simplified/purpose/reduce.svg';
import IncreaseIcon from '../../assets/img/simplified/purpose/increase.svg';
import RiskImg from '../../assets/img/simplified/purpose/Risks.svg';
import IncomeImg from '../../assets/img/simplified/purpose/income.svg';
// diversify and harvest images
import WheatImg from '../../assets/img/simplified/diversify/wheatY.svg';
import WheatBImg from '../../assets/img/simplified/diversify/wheatB.svg';
import WheatRImg from '../../assets/img/simplified/diversify/wheatR.svg';
import WheatPImg from '../../assets/img/simplified/diversify/wheatP.svg';
import WheatGImg from '../../assets/img/simplified/diversify/wheatG.svg';
// Harvest component images
import WheatNotImg from '../../assets/img/simplified/diversify/wheatNoProfit.svg';


// Card component
export const cardData: Array<ICard> = [
  { 
    title: 'Reduce risks',
    icon: ReduceIcon,
    img: RiskImg,
    description: `The difference here is that you invest in several coins at once. Such a group is called an index - it's safer this way, below we will explain why.`
  },
  { 
    title: 'Increase income',
    icon: IncreaseIcon,
    img: IncomeImg,
    description: `The coins in your index have value, with each offering opportunities to receive passive income - money earned without working!`
  },
];

// Diversify component
export const diversifysData: Array<IWheats> = [
  {
    name: 'John',
    emoji: '🤔',
    description: `John has five fields, and plants five fields of wheat. He has not diversified his portfolio.`,
    wheat: [
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg
      },
    ]
  },
  {
    name: 'David',
    emoji: '😌',
    description: `David also has 5 fields, but has planted a different crop in each one.`,
    wheat: [
      {
        background: 'normal',
        profit: false,
        wheat: WheatImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatBImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatRImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatPImg
      },
      {
        background: 'normal',
        profit: false,
        wheat: WheatGImg
      },
    ]
  }
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
        wheat: WheatNotImg
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg
      },
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg
      },
    ]
  },
  {
    name: 'David',
    emoji: '😎',
    wheat: [
      {
        background: 'none',
        profit: false,
        wheat: WheatNotImg
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatBImg
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatRImg
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatPImg
      },
      {
        background: 'none',
        profit: true,
        wheat: WheatGImg
      }
    ]
  }
]