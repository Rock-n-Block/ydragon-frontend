import React from 'react';

export interface IValue {
  val?: any;
}

const Input: React.FC<IValue> = ({ val }) => {
  return (
    <div className="input-border">
      <input type="text" value={val} className="input" />
    </div>
  );
};

export default Input;
