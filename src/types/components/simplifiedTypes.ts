//  Wheats component
export interface IWheatImg {
  background?: string;
  profit: boolean;
  wheat: string;
}
export interface IWheats {
  name: string;
  emoji: string;
  description?: string;
  wheat: IWheatImg[];
  animData?: any;
  isAnim: boolean;
}

// Card component
export interface ICard {
  title: string;
  icon: string;
  img: any;
  description: string;
}
