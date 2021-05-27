import React from 'react';

import { Link } from 'react-router-dom';
import { Button as BtnAntd } from 'antd';

import './Button.scss';
import classNames from 'classnames';

export interface IColorScheme {
  colorScheme?: 'outline' | 'filled' | 'green';
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

interface IButton extends IColorScheme, ISize, IBorderSize, IBackground, IType {
  onClick?: () => void;
  className?: string;
  link?: string;
  linkClassName?: string;
}
const Button: React.FC<IButton> = ({
  colorScheme = 'filled',
  type,
  background,
  link,
  linkClassName,
  size = 'md',
  borderSize = 'md',
  className,
  onClick,
  children,
}) => {
  const Btn = (
    <BtnAntd
      onClick={onClick}
      type={type}
      className={classNames(
        className,
        'btn',
        `btn-${size}`,
        `btn-${colorScheme}`,
        `btn-background-${background}`,
      )}
    >
      {children}
    </BtnAntd>
  );
  let outlineBtn;
  if (colorScheme === 'outline') {
    outlineBtn = (
      <div className={classNames('btn-outline__wrapper', `btn-border-${borderSize}`)}>{Btn}</div>
    );
  }
  if (link) {
    return (
      <Link className={classNames('btn-link', linkClassName)} to={link}>
        {colorScheme === 'outline' ? outlineBtn : Btn}
      </Link>
    );
  }
  return Btn;
};

export default Button;
