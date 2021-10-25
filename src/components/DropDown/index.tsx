import React, { useState } from 'react';
import cn from 'classnames';

import DropDownItem from './DropDownItem';

import './DropDown.scss';
import OutsideAlerter from '../../utils/outsideClickWrapper';

interface IDropDownLink {
  title: string;
  link: string;
  needAuth?: boolean;
}

interface IDropDownProps {
  title: string;
  links: Array<IDropDownLink>;
}

const DropDown: React.FC<IDropDownProps> = ({ title, links }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClose = () => {
    setIsActive(false);
  };

  return (
    <div className="dropdown">
      <OutsideAlerter fn={handleClose}>
        <div
          className={cn('dropdown-title', { 'dropdown-title--active': isActive })}
          tabIndex={0}
          onKeyDown={() => {}}
          role="button"
          onMouseEnter={() => setIsActive(true)}
          onMouseLeave={() => setIsActive(false)}
        >
          {title}
        </div>
        <div className="dropdown-body_wrapper">
          <div
            className={cn('dropdown-body', { 'dropdown-body--active': isActive })}
            onMouseEnter={() => setIsActive(true)}
            onMouseLeave={() => setIsActive(false)}
          >
            {links.map((link) => (
              <DropDownItem
                key={link.title}
                handleClose={handleClose}
                title={link.title}
                link={link.link}
                needAuth={link.needAuth || false}
              />
            ))}
          </div>
        </div>
      </OutsideAlerter>
    </div>
  );
};

export default DropDown;
