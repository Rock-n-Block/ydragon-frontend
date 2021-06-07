import React from 'react';

import './GradientText.scss';

const GradientText: React.FC<{ text: string; width: string; height: string }> = ({
  text,
  width,
  height,
}) => {
  const vb = `0 0 ${width} ${height}`;

  return (
    <svg width={width} height={height} viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text y="98%" strokeWidth="2" stroke="url(#gradient)" fill="none">
        {text}
      </text>
    </svg>
  );
};

export default GradientText;
