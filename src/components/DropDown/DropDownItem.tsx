import React from 'react';
import { NavHashLink } from 'react-router-hash-link';
import { observer } from 'mobx-react';

import { useMst } from '../../store/store';

interface IDropDownItem {
  title: string;
  link: string;
  needAuth?: boolean;
  handleClose: () => void;
}

const DropDownItem: React.FC<IDropDownItem> = observer(({ title, link, handleClose, needAuth }) => {
  const { user } = useMst();

  if (needAuth && !user.address) {
    return (
      <div className="dropdown-body_item dropdown-body_item--not-allowed">
        <span>{title}</span>
      </div>
    );
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
