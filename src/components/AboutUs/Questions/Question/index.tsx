import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import iconDown from '../../../../assets/img/icons/icon-arrow-down-white.svg';
import iconUp from '../../../../assets/img/icons/icon-arrow-up-white.svg';

import './Question.scss';

interface QuestionProps {
  title: string;
  text: string;
}

const Question: React.FC<QuestionProps> = observer(({ title, text }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="question">
      <div className="question__text--wrapper">
        <span className={`question__title ${collapsed ? null : 'color'}`}>{title}</span>
        {!collapsed && <span className="question__text">{text}</span>}
      </div>
      <div
        role="button"
        tabIndex={0}
        onKeyDown={() => setCollapsed(!collapsed)}
        onClick={() => setCollapsed(!collapsed)}
      >
        <img alt="#" src={collapsed ? iconDown : iconUp} className="question__icon" />
      </div>
    </div>
  );
});

export default Question;
