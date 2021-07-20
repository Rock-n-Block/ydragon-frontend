import React, { PropsWithChildren, useState } from 'react';
import { observer } from 'mobx-react-lite';

import iconDownBlack from '../../../../assets/img/icons/icon-arrow-down-black.svg';
import iconDown from '../../../../assets/img/icons/icon-arrow-down-white.svg';
import { DARK, useMst } from '../../../../store/store';

import './Question.scss';

interface QuestionProps {
  title: string;
  children: React.ReactNode;
}

const Question: React.FC<QuestionProps> = observer((props: PropsWithChildren<QuestionProps>) => {
  const [collapsed, setCollapsed] = useState(true);
  const { theme } = useMst();
  const { title, children } = props;
  const element = <span className={`question__text ${collapsed ? 'invisible' : 'visible'}`} />;
  return (
    <div className="question">
      <div className="question__text--wrapper">
        <div
          className={`question__title ${
            collapsed ? `color${DARK === theme.value ? 'White' : 'Black'}` : 'colorOrange'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={() => setCollapsed(!collapsed)}
          onClick={() => setCollapsed(!collapsed)}
        >
          {title}
          <img
            alt="arrow down"
            src={DARK === theme.value ? iconDown : iconDownBlack}
            className={`question__icon ${collapsed ? '' : 'down'}`}
            width="24"
            height="14"
          />
        </div>
        {React.cloneElement(element, { children })}
      </div>
    </div>
  );
});

export default Question;
