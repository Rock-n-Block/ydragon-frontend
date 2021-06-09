import YDRLogo from '../assets/img/icons/logo.svg';
import BinanceLogo from '../assets/img/icons/logo-binance.svg';

export interface ITokenMini {
  name: string;
  logo: string;
}
export const platformToken: ITokenMini = { name: 'YDR', logo: YDRLogo };
export const tokensArray: Array<ITokenMini> = [
  { name: 'BNB', logo: BinanceLogo },
  { name: 'WBNB', logo: YDRLogo },
];
