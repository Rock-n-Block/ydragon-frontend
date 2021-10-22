import React, { useState } from 'react';
import cn from 'classnames';
import { NavHashLink } from 'react-router-hash-link';

interface IHeaderMobileItemLink {
  title: string;
  link: string;
  onCollapsedChange?: (foo: boolean) => void;
}

interface IHeaderMobileItemProps {
  title: string;
  titleLink?: string;
  links?: Array<IHeaderMobileItemLink>;
  onCollapsedChange: (foo: boolean) => void;
}

const HeaderMobLink: React.FC<IHeaderMobileItemLink> = ({ title, link, onCollapsedChange }) => {
  return (
    <>
      {link.startsWith('/') && !link.includes('.pdf') ? (
        <NavHashLink
          to={link}
          className="menu-nav__item__link"
          onClick={() => onCollapsedChange && onCollapsedChange(true)}
        >
          {title}
        </NavHashLink>
      ) : (
        <a href={link} target="_blank" rel="noreferrer" className="menu-nav__item__link">
          {title}
        </a>
      )}
    </>
  );
};

const HeaderMobileItem: React.FC<IHeaderMobileItemProps> = ({
  title,
  links,
  onCollapsedChange,
  titleLink,
}) => {
  const [isOpened, setIsOpened] = useState(true);
  return (
    <li className="menu-nav__item">
      {titleLink ? (
        <NavHashLink
          to={titleLink}
          onClick={() => onCollapsedChange && onCollapsedChange(true)}
          className="menu-nav__item__title"
        >
          {title}
        </NavHashLink>
      ) : (
        <div
          tabIndex={0}
          role="button"
          onKeyDown={() => {}}
          onClick={() => setIsOpened((prev) => !prev)}
          className="menu-nav__item__title"
        >
          {title}
        </div>
      )}

      {links && (
        <div className={cn('menu-nav__item__links', { 'menu-nav__item__links--active': isOpened })}>
          {links.map((link) => (
            <HeaderMobLink key={link.link} {...link} onCollapsedChange={onCollapsedChange} />
          ))}
        </div>
      )}
    </li>
  );
};

export default HeaderMobileItem;
