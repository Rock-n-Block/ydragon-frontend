import React from 'react';

import './Button.scss';

interface IButton{
  onClick?:()=>void;
  className?: string;
}
const Button: React.FC<IButton> = ({ className,onClick, children }) => {
  return (
    <button type="button" className={`button ${className}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
