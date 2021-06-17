import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd, ButtonProps } from 'antd';
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

export interface IBorderSize {
  borderSize?: 'sm' | 'md' | 'lg';
}

interface IButton extends IStyledType, IColorScheme, IBorderSize, IBackground, ButtonProps {
  className?: string;
  link?: string;
  linkClassName?: string;
}
const Button: React.FC<IButton> = (props: PropsWithChildren<IButton>) => {
  const {
    styledType = 'filled',
    colorScheme,
    background,
    link,
    linkClassName,
    className,
    children,
    ...otherButtonProps
  } = props;
  const Btn = (
    <BtnAntd
      className={classNames(
        'btn',
        `btn-${styledType}`,
        `btn-${background}`,
        `btn-${colorScheme}`,
        className,
      )}
      {...otherButtonProps}
    >
      {children}
    </BtnAntd>
  );
  if (link) {
    return (
      <Link className={classNames('btn-link', linkClassName)} to={link}>
        {Btn}
      </Link>
    );
  }
  return Btn;
};

export default Button;
