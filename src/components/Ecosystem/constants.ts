import { FC } from 'react';
import { Products, IndexProducts } from './components';

export const ecosystemSetArray = <const>[
  'Products',
  'Index Products',
  'StakePad',
  'Private Blockchain Funds',
];
export type TEcosystemSet = typeof ecosystemSetArray[number];

export const ecosystem: Record<TEcosystemSet, FC[]> = {
  'Products': [Products],
  'Index Products': [IndexProducts],
  'Private Blockchain Funds': [Products],
  'StakePad': [Products],
};
