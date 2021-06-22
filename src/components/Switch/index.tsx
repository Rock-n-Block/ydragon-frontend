import React from 'react';
import { Switch as AntdSwitch, SwitchProps } from 'antd';

const Switch: React.FC<SwitchProps> = ({ onChange, ...otherSwitchProps }) => {
  const handleChange = (isChecked: boolean, e: any) => {
    if (onChange) {
      onChange(isChecked, e);
    }
  };
  return (
    <div className="switch">
      <AntdSwitch onChange={handleChange} {...otherSwitchProps} />
    </div>
  );
};
export default Switch;
