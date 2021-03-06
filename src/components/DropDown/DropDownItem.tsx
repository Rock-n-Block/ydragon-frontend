import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';

import { useMst } from '../../store/store';
import { chainsEnum } from '../../types';

interface IDropDownItem {
  title: string;
  link: string;
  auth?: Array<string>;
  handleClose: () => void;
}

const DropDownItem: React.FC<IDropDownItem> = observer(({ title, link, handleClose, auth }) => {
  const { user, networks, modals } = useMst();

  if (auth?.includes('login') && !user.isUser) {
    return (
      <div
        role="button"
        onKeyDown={() => {}}
        tabIndex={0}
        onClick={() => modals.connectWallet.open(link)}
        className="dropdown-body_item"
      >
        <span>{title}</span>
      </div>
    );
  }

  if (auth?.includes('noEth') && networks.currentNetwork === chainsEnum.Ethereum) {
    return <></>;
  }

  return (
    <>
      {link.startsWith('/') && !link.includes('.pdf') ? (
        <NavHashLink
          activeClassName="dropdown-body_item--active"
          className="dropdown-body_item"
          smooth
          to={link}
          onClick={() => handleClose()}
        >
          <span>{title}</span>
        </NavHashLink>
      ) : (
        <a
          target="_blank"
          rel="noreferrer"
          onClick={() => handleClose()}
          href={link}
          className="dropdown-body_item"
        >
          <span> {title}</span>
        </a>
      )}
    </>
  );
});

export default DropDownItem;
