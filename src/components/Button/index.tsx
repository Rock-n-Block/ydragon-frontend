import React, { PropsWithChildren, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd, ButtonProps } from 'antd';
import classNames from 'classnames';
import { Tooltip } from '../index';

import './Button.scss';

export interface IStyledType {
  styledType?: 'outline' | 'filled' | 'nav' | 'clear';
}

export interface IColorScheme {
  colorScheme?: 'orange' | 'green' | 'red';
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
  tooltip?: string;
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
    tooltip,
    onClick,
    ...otherButtonProps
  } = props;

  const [showTooltip, setShowTooltip] = useState(false);
  const user = !!localStorage?.yd_address || false;
  let onClickFunction = onClick;

  const onVisibleChange = (e: any) => {
    e.preventDefault();
    setShowTooltip(true);
  };
  if (!user && tooltip) {
    onClickFunction = onVisibleChange;
  }
  const onBlurHandler = () => {
    setShowTooltip(false);
  };

  const Btn = (
    <>
      <BtnAntd
        className={classNames(
          'btn',
          `btn-${styledType}`,
          `btn-${background}`,
          `btn-${colorScheme}`,
          className,
        )}
        onClick={onClickFunction}
        onBlur={onBlurHandler}
        {...otherButtonProps}
      >
      {tooltip ? <Tooltip title={tooltip} visible={!user && showTooltip}>{children}</Tooltip> : children}
      </BtnAntd>
    </>
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
