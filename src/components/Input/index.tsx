import React from 'react';
import { Input as InputAntd, Select } from 'antd';
import { ITokenMini } from '../../utils/tokenMini';
import { ReactComponent as ArrowDown } from '../../assets/img/icons/icon-arrow-down.svg';
import Icon from '@ant-design/icons';

const { Option } = Select;

export interface IValue {
  value?: string | number;
  name?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const Input: React.FC<IValue> = ({ value, name, placeholder, onChange, onBlur }) => {
  return (
    <div className="input-border">
      <InputAntd
        name={name}
        type="text"
        value={value}
        className="input"
        placeholder={placeholder}
        onChange={onChange}
        onBlur={onBlur}
      />
    </div>
  );
};

interface InputWithSelectProps extends IValue {
  tokens: ITokenMini | Array<ITokenMini>;
  onSelectChange?: () => void;
}

export const InputWithSelect: React.FC<InputWithSelectProps> = ({
  value,
  name,
  tokens,
  placeholder,
  onChange,
  onSelectChange,
  onBlur,
}) => {
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
            <Option value={token.name}>
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
      <InputAntd
        name={name}
        type="text"
        value={value}
        placeholder={placeholder}
        className="input"
        onChange={onChange}
        onBlur={onBlur}
      />
      {tokenOrSelect}
    </div>
  );
};

export default Input;
