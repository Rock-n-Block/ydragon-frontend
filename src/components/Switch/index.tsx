import React, { useEffect, useState } from 'react';
import './Switch.scss';

interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({ checked = false, onChange }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleChange = (): void => {
    setIsChecked(!isChecked);
  };
  useEffect(() => {
    console.log(isChecked);
    if (onChange) {
      onChange(isChecked);
    }
  }, [onChange, isChecked]);
  return (
    <label className="switch">
      <input type="checkbox" checked={isChecked} onClick={handleChange} />
      <span className="slider" />
    </label>
  );
};
export default Switch;
