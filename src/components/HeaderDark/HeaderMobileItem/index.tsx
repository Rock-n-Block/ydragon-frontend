import React, { useState } from 'react';
import cn from 'classnames';
import { NavHashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react-lite';

import { useMst } from '../../../store/store';
import { chainsEnum } from '../../../types';

interface IHeaderMobileItemLink {
  title: string;
  link: string;
  onCollapsedChange?: (foo: boolean) => void;
  auth?: string;
}

interface IHeaderMobileItemProps {
  title: string;
  titleLink?: string;
  links?: Array<IHeaderMobileItemLink>;
  onCollapsedChange: (foo: boolean) => void;
  auth: string;
}

const HeaderMobLink: React.FC<IHeaderMobileItemLink> = observer(
  ({ title, link, onCollapsedChange, auth }) => {
    const { networks, user, modals } = useMst();
    if (auth === 'notEth' && networks.currentNetwork === chainsEnum.Ethereum) {
      return <></>;
    }

    const isNeedWalletModal = auth === 'login' && !user.address;

    return (
      <>
        {link.startsWith('/') && !link.includes('.pdf') ? (
          <NavHashLink
            to={link}
            className="menu-nav__item__link"
            onClick={(e) => {
              if (onCollapsedChange) {
                onCollapsedChange(true);
                if (isNeedWalletModal) {
                  modals.connectWallet.open(link);
                  e.preventDefault();
                }
              }
            }}
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
  },
);

const HeaderMobileItem: React.FC<IHeaderMobileItemProps> = observer(
  ({ title, links, onCollapsedChange, titleLink, auth }) => {
    const [isOpened, setIsOpened] = useState(true);
    const { user } = useMst();

    if (auth === 'admin' && !user.isAdmin) return <></>;
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
            className={cn('menu-nav__item__title menu-nav__item__title--arrow', {
              'menu-nav__item__title--opened': isOpened,
            })}
          >
            {title}
          </div>
        )}

        {links && (
          <div
            className={cn('menu-nav__item__links', { 'menu-nav__item__links--active': isOpened })}
          >
            {links.map((link) => (
              <HeaderMobLink key={link.link} {...link} onCollapsedChange={onCollapsedChange} />
            ))}
          </div>
        )}
      </li>
    );
  },
);

export default HeaderMobileItem;
