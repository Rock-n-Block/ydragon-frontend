import plant from '../../../assets/json-anim/benefits-plant.json';
import plantL from '../../../assets/json-anim/benefits-plant-light.json';
import shapes from '../../../assets/json-anim/benefits-shapes.json';
import tiles from '../../../assets/json-anim/benefits-tiles.json';
import tilesL from '../../../assets/json-anim/benefits-tiles-light.json';
import valutes from '../../../assets/json-anim/feature-1.json';
import valutesL from '../../../assets/json-anim/feature-1-light.json';

export const data = [
  {
    title: 'Promising Projects',
    subtitle: 'Exposure to upcoming, highly promising projects on emerging chains.',
    icon: plant,
    iconLight: plantL,
  },

  {
    title: 'Upcoming Yield Farms',
    subtitle: 'Access to assets gaining yield farming opportunites found on emerging chains',
    icon: shapes,
    iconLight: shapes,
  },

  {
    title: 'New Usecases',
    subtitle: 'Exposure to new use cases that don’t currently have liquid projects to support them',
    icon: tiles,
    iconLight: tilesL,
  },

  {
    title: 'NFT Exposure',
    subtitle: 'Exposure to non-fungible assets in a novel way',
    icon: valutes,
    iconLight: valutesL,
  },
];
