import React from 'react';

import './Button.scss';

const Button: React.FC<{ text: string }> = ({ text }) => {
  return (
    <button type="button" className="button">
      {text}
    </button>
  );
};

export default Button;
