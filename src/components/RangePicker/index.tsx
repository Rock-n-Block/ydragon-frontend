import React from 'react';
import { DatePicker as AntdDatePicker } from 'antd';
import { RangePickerProps } from 'antd/lib/date-picker/index';
import classNames from 'classnames';

const { RangePicker } = AntdDatePicker;

const CustomRangePicker: React.FC<RangePickerProps> = (props) => {
  const { className, ...otherRangePickerProps } = props;
  return (
    <div className={`input-border range-picker ${classNames(className)}`}>
      <RangePicker {...otherRangePickerProps} />
      {/* <RangePicker className={classNames(className)} {...otherRangePickerProps} /> */}
    </div>
  );
};
export default CustomRangePicker;
