import React, { useState } from 'react';
import cn from 'classnames';

import DropDownItem from './DropDownItem';

import './DropDown.scss';
import OutsideAlerter from '../../utils/outsideClickWrapper';

interface IDropDownProps {
  title: string;
  links: Array<{
    title: string;
    link: string;
    needAuth?: boolean;
  }>;
}

const DropDown: React.FC<IDropDownProps> = ({ title, links }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClose = () => {
    setIsActive(false);
  };

  return (
    <div className="dropdown">
      <div
        className={cn('dropdown-title', { 'dropdown-title--active': isActive })}
        tabIndex={0}
        onKeyDown={() => {}}
        role="button"
        onClick={() => setIsActive((prev) => !prev)}
      >
        {title}
      </div>
      <OutsideAlerter fn={handleClose}>
        <div className={cn('dropdown-body', { 'dropdown-body--active': isActive })}>
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
      </OutsideAlerter>
    </div>
  );
};

export default DropDown;
