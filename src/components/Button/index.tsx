import React, { PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import { Button as BtnAntd, ButtonProps } from 'antd';
import classNames from 'classnames';
import { observer } from 'mobx-react';

import { useMst } from '../../store/store';

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
  target?: string;
  rel?: string;
  linkClassName?: string;
  needLogin?: string;
  wrongBlockchain?: string | null;
}

const Button: React.FC<IButton> = observer((props: PropsWithChildren<IButton>) => {
  const {
    styledType = 'filled',
    colorScheme,
    background,
    link,
    linkClassName,
    className,
    children,
    needLogin,
    wrongBlockchain,
    onClick,
    disabled,
    target,
    rel,
    ...otherButtonProps
  } = props;

  const { modals, user } = useMst();

  const onVisibleChange = (e: any, message: string) => {
    e.preventDefault();
    modals.metamask.setErr(`${message}`);
  };

  const handleClick = (e: any) => {
    if (!user.address && needLogin) {
      onVisibleChange(e, needLogin);
    } else if (wrongBlockchain) {
      onVisibleChange(e, wrongBlockchain);
    } else if (onClick) {
      onClick(e);
    }
  };

  const Btn = (
    <>
      <BtnAntd
        className={classNames(
          'btn',
          `btn-${styledType}`,
          `btn-${background}`,
          `btn-${colorScheme}`,
          disabled && styledType === 'outline' ? `disabled ${className}` : className,
        )}
        onClick={handleClick}
        disabled={disabled}
        {...otherButtonProps}
      >
        {children}
      </BtnAntd>
    </>
  );
  if (link) {
    return !target ? (
      <Link className={classNames('btn-link', linkClassName)} to={link}>
        {Btn}
      </Link>
    ) : (
      <a className={classNames('btn-link', linkClassName)} href={link} target={target} rel={rel}>
        {Btn}
      </a>
    );
  }
  return Btn;
});

export default Button;
