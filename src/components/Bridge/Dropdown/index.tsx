import React, { useState } from 'react';

import arrowDown from '../../../assets/img/icons/icon-arrow-down-orange.svg';

import './Dropdown.scss';

interface DropdownProps {
  items: {
    img: string;
    title: string;
  }[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ items, activeIndex, setActiveIndex }) => {
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  return (
    <div className={`gradient-box ${isSelectOpen ? 'open' : null}`}>
      <div
        role="button"
        tabIndex={0}
        className={`gradient-box__switch ${isSelectOpen ? 'open' : 'close'} ${
          items.length > 1 ? 'pointer' : ''
        }`}
        onClick={() => setIsSelectOpen(!isSelectOpen)}
        onKeyPress={() => console.log('keypress')}
      >
        <div className={`box select ${isSelectOpen ? 'open' : null}`}>
          <div className="box__items">
            <div className="box__items__header">
              <div className="box__items__item box__items__item">
                <div className="box__items__item__logo">
                  <img src={items[activeIndex].img} alt="index logo" />
                </div>
                <div className="box__items__item__title">{items[activeIndex].title}</div>
              </div>
              {items.length > 1 ? (
                <img className="arrow" src={arrowDown} alt="arrow down orange" />
              ) : null}
            </div>

            {isSelectOpen
              ? items.map((item, id) => {
                  if (id !== activeIndex)
                    return (
                      <div
                        className="box__items__item"
                        role="button"
                        tabIndex={0}
                        onKeyPress={() => console.log('change active index')}
                        key={item.title}
                        onClick={() => {
                          setActiveIndex(id);
                          setIsSelectOpen(false);
                        }}
                      >
                        <div className="box__items__item__logo">
                          <img src={item.img} alt="index logo" />
                        </div>
                        <div className="box__items__item__title grey">{item.title}</div>
                      </div>
                    );
                  return null;
                })
              : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
