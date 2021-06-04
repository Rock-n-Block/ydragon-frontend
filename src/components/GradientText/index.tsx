import React from 'react';

import './GradientText.scss';

interface OutlineTextProps {
  text: string;
  width: string;
  height: string;
}

const OutlineText: React.FC<OutlineTextProps> = ({ text, width, height, children }) => {
  const vb = `0 0 ${width} ${height}`;

  return (
    <svg width={width} height={height} viewBox={vb} fill="none" xmlns="http://www.w3.org/2000/svg">
      <text y="98%" strokeWidth="2" stroke="url(#gradient)" fill="none">
        {children}
      </text>
    </svg>
  );
};

export default OutlineText;
