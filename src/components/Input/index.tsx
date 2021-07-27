import React from 'react';
import nextId from 'react-id-generator';
import Icon from '@ant-design/icons';
import {
  Input as InputAntd,
  InputNumber as InputNumberAntd,
  InputNumberProps,
  InputProps,
  Select,
} from 'antd';
import { TextAreaProps } from 'antd/lib/input';
import { observer } from 'mobx-react';

import { ReactComponent as ArrowDownBlack } from '../../assets/img/icons/icon-arrow-down.svg';
import { ReactComponent as ArrowDownWhite } from '../../assets/img/icons/icon-arrow-white.svg';
import { DARK, useMst } from '../../store/store';
import { ITokenMini } from '../../utils/tokenMini';

const { Option } = Select;
const { TextArea } = InputAntd;

interface InputWithProps extends InputProps {
  error?: boolean;
  className?: string;
}

const Input: React.FC<InputWithProps> = (props) => {
  const { className, error, ...otherProps } = props;
  return (
    <div className={`input-border ${className ?? ''}${error ? '--error' : ''}`}>
      <InputAntd onWheel={(e) => e.currentTarget.blur()} className="input" {...otherProps} />
    </div>
  );
};

interface InputWithSelectProps extends InputProps {
  tokens: ITokenMini | Array<ITokenMini>;
  onSelectChange?: (value: string) => void;
  getPopupContainer?: boolean;
}

export const InputWithSelect: React.FC<InputWithSelectProps> = observer((props) => {
  const { getPopupContainer = false, tokens, onSelectChange, ...otherInputProps } = props;
  const { theme } = useMst();

  let tokenOrSelect;
  if (Array.isArray(tokens)) {
    tokenOrSelect = (
      <div className="input-with-select__tokens">
        <Select
          className="input-with-select__select"
          onChange={onSelectChange}
          defaultValue={tokens[0].name}
          dropdownMatchSelectWidth={false}
          getPopupContainer={getPopupContainer ? (trigger) => trigger.parentNode : undefined}
          suffixIcon={<Icon component={DARK === theme.value ? ArrowDownWhite : ArrowDownBlack} />}
        >
          {tokens.map((token) => (
            <Option value={token.name} key={nextId()}>
              <h4 className="input-with-select__name">{token.name}</h4>
              <div className="input-with-select__logo">
                <img src={token.logo} alt={`${token.name} logo`} width="18" height="18" />
              </div>
            </Option>
          ))}
        </Select>
      </div>
    );
  } else {
    tokenOrSelect = (
      <div className="input-with-select__token">
        <h4 className="input-with-select__name">{tokens.name}</h4>
        <div className="input-with-select__logo">
          <img src={tokens.logo} alt={`${tokens.name} logo`} width="18" height="18" />
        </div>
      </div>
    );
  }
  return (
    <div className="input-with-select input-border">
      <InputAntd onWheel={(e) => e.currentTarget.blur()} className="input" {...otherInputProps} />
      {tokenOrSelect}
    </div>
  );
});
export const InputNumber: React.FC<InputNumberProps> = (props) => {
  return (
    <div className="input-border">
      <InputNumberAntd onWheel={(e) => e.currentTarget.blur()} className="input" {...props} />
    </div>
  );
};
interface ITextArea extends TextAreaProps {
  textAreaClassName?: string;
}
export const StyledTextArea: React.FC<ITextArea> = (props) => {
  const { textAreaClassName, className, ...otherProps } = props;
  return (
    <div className={`input-border text-area ${className || ''}`}>
      <TextArea className={`input ${textAreaClassName || ''}`} {...otherProps} />
    </div>
  );
};
export default Input;
