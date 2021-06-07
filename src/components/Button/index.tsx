import React from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd } from 'antd';
import classNames from 'classnames';

import './Button.scss';

export interface IStyledType {
  styledType?: 'outline' | 'filled' | 'nav' | 'clear';
}

export interface IColorScheme {
  colorScheme?: 'orange' | 'green';
}

export interface IBackground {
  background?: 'white' | 'gray';
}

export interface ISize {
  size?: 'sm' | 'md' | 'lg';
}
export interface IBorderSize {
  borderSize?: 'sm' | 'md' | 'lg';
}
export interface IType {
  type?: 'default' | 'text' | 'link';
}

interface IButton extends IStyledType, IColorScheme, ISize, IBorderSize, IBackground, IType {
  onClick?: () => void;
  className?: string;
  link?: string;
  linkClassName?: string;
  disabled?: boolean;
}
const Button: React.FC<IButton> = ({
  styledType = 'filled',
  colorScheme,
  type,
  background,
  link,
  linkClassName,
  size = 'md',
  borderSize = 'md',
  className,
  onClick,
  disabled = false,
  children,
}) => {
  const Btn = (
    <BtnAntd
      onClick={onClick}
      type={type}
      className={classNames(
        'btn',
        `btn-${size}`,
        `btn-${styledType}`,
        `btn-${background}`,
        styledType === 'outline' ? '' : className,
      )}
      disabled={disabled}
    >
      {children}
    </BtnAntd>
  );
  let outlineBtn;
  if (styledType === 'outline') {
    outlineBtn = (
      <div
        className={classNames(
          'btn-outline',
          `btn-outline-${colorScheme}`,
          `btn-outline-${borderSize}`,
          className,
        )}
      >
        {Btn}
      </div>
    );
  }
  if (link) {
    return (
      <Link className={classNames('btn-link', linkClassName)} to={link}>
        {styledType === 'outline' ? outlineBtn : Btn}
      </Link>
    );
  }
  return outlineBtn || Btn;
};

export default Button;
