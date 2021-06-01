import React from 'react';

export interface IValue {
  value?: string|number;
  name?:string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
}

const Input: React.FC<IValue> = ({ value,name,onChange,onBlur }) => {
  return (
    <div className="input-border">
      <input name={name} type="text" value={value} className="input" onChange={onChange} onBlur={onBlur}/>
    </div>
  );
};

export default Input;
