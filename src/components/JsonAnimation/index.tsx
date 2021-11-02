import React from 'react';
import { Lottie } from '@crello/react-lottie';

interface IJsonAnimationProps {
  animData: any;
  height?: string;
  width?: string;
  className?: string;
}

const JsonAnimation: React.FC<IJsonAnimationProps> = React.memo(
  ({ animData, height, width, className }) => (
    <Lottie
      height={height}
      width={width}
      className={className}
      config={{ animationData: animData, loop: true }}
    />
  ),
);
export default JsonAnimation;
