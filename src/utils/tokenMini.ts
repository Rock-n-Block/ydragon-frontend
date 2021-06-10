import YDRLogo from '../assets/img/icons/logo.svg';
import BinanceLogo from '../assets/img/icons/logo-binance.svg';
import USDTLogo from '../assets/img/icons/logo-usdt.svg';

export type TokenMiniNameTypes = 'YDR' | 'BNB' | 'WBNB' | 'USDT';

export interface ITokenMini {
  name: TokenMiniNameTypes;
  logo: string;
}
export const platformToken: ITokenMini = { name: 'YDR', logo: YDRLogo };
export const tokensArray: Array<ITokenMini> = [
  { name: 'BNB', logo: BinanceLogo },
  { name: 'WBNB', logo: BinanceLogo },
  { name: 'USDT', logo: USDTLogo },
];
