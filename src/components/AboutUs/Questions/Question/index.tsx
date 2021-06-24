import React, { PropsWithChildren, useState } from 'react';

import iconDown from '../../../../assets/img/icons/icon-arrow-down-white.svg';

import './Question.scss';

interface QuestionProps {
  title: string;
  children: React.ReactNode;
}

const Question: React.FC<QuestionProps> = (props: PropsWithChildren<QuestionProps>) => {
  const [collapsed, setCollapsed] = useState(true);
  const { title, children } = props;
  const element = <span className={`question__text ${collapsed ? 'invisible' : 'visible'}`} />;
  return (
    <div className="question">
      <div className="question__text--wrapper">
        <span
          className={`question__title ${collapsed ? 'colorWhite' : 'colorOrange'}`}
          role="button"
          tabIndex={0}
          onKeyDown={() => setCollapsed(!collapsed)}
          onClick={() => setCollapsed(!collapsed)}
        >
          {title}
        </span>
        {React.cloneElement(element, { children })}
      </div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => setCollapsed(!collapsed)}
        onClick={() => setCollapsed(!collapsed)}
        className="question__icon-wrapper"
      >
        <img alt="#" src={iconDown} className={`question__icon ${collapsed ? '' : 'down'}`} />
      </div>
    </div>
  );
};

export default Question;
