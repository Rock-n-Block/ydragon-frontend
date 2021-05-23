import React from 'react';

import './Button.scss';

const Button: React.FC<{ className?: string; text: string }> = ({ className, text }) => {
  return (
    <button type="button" className={`button ${className}`}>
      {text}
    </button>
  );
};

export default Button;
