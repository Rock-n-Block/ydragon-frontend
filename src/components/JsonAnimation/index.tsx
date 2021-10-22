import React from 'react';
import { Lottie } from '@crello/react-lottie';

interface IJsonAnimationProps {
  animData: any;
  height?: string;
  width?: string;
}

const JsonAnimation: React.FC<IJsonAnimationProps> = ({ animData, height, width }) => (
  <Lottie height={height} width={width} config={{ animationData: animData, loop: true }} />
);
export default JsonAnimation;
