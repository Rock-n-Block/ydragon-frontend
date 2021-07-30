import BinanceLogo from '../assets/img/icons/logo-binance.svg';
import USDTLogo from '../assets/img/icons/logo-usdt.svg';
import YDRLogo from '../assets/img/icons/logo.svg';

export type TokenMiniNameTypes = 'YDR' | 'BNB' | 'WBNB' | 'USDT';

export interface ITokenMini {
  name: TokenMiniNameTypes | string;
  image: string;
  address?: string;
  symbol?: string;
  decimals?: number;
}
export const platformToken: ITokenMini = { name: 'YDR', image: YDRLogo };
export const defaultTokens: Array<ITokenMini> = [
  { name: 'BNB', image: BinanceLogo },
  { name: 'WBNB', image: BinanceLogo },
  { name: 'USDT', image: USDTLogo },
];
