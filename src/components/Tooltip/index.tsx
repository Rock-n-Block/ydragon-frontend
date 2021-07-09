import React, {PropsWithChildren} from 'react';
import { Tooltip as AntdTooltip } from 'antd';

interface TooltipProps {
  title: string;
  visible: boolean;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = (props: PropsWithChildren<TooltipProps>) => {
  const { title, visible, children, ...otherTooltipProps } = props
  return (
    <AntdTooltip
      title={title}
      visible={visible}
      placement="top"
      destroyTooltipOnHide
      {...otherTooltipProps}
    >
      {children}
    </AntdTooltip>
  );
};
export default Tooltip;
