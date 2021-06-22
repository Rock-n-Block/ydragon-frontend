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

import { ReactComponent as ArrowDown } from '../../assets/img/icons/icon-arrow-down.svg';
import { ITokenMini } from '../../utils/tokenMini';

const { Option } = Select;

const Input: React.FC<InputProps> = (props) => {
  return (
    <div className="input-border">
      <InputAntd className="input" {...props} />
    </div>
  );
};

interface InputWithSelectProps extends InputProps {
  tokens: ITokenMini | Array<ITokenMini>;
  onSelectChange?: (value: string) => void;
}

export const InputWithSelect: React.FC<InputWithSelectProps> = (props) => {
  const { tokens, onSelectChange, ...otherInputProps } = props;

  let tokenOrSelect;
  if (Array.isArray(tokens)) {
    tokenOrSelect = (
      <div className="input-with-select__tokens">
        <Select
          className="input-with-select__select"
          onChange={onSelectChange}
          defaultValue={tokens[0].name}
          suffixIcon={<Icon component={ArrowDown} />}
        >
          {tokens.map((token) => (
            <Option value={token.name} key={nextId()}>
              <h4 className="input-with-select__name">{token.name}</h4>
              <div className="input-with-select__logo">
                <img src={token.logo} alt={`${token.name} logo`} />
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
          <img src={tokens.logo} alt={`${tokens.name} logo`} />
        </div>
      </div>
    );
  }
  return (
    <div className="input-with-select input-border">
      <InputAntd className="input" {...otherInputProps} />
      {tokenOrSelect}
    </div>
  );
};
export const InputNumber: React.FC<InputNumberProps> = (props) => {
  return (
    <div className="input-border">
      <InputNumberAntd className="input" {...props} />
    </div>
  );
};
export default Input;
