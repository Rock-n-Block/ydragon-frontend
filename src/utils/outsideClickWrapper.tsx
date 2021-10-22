import React, { useRef } from 'react';
import { useOutsideAlerter } from '../hooks/useOutsiderAlert';

/**
 * Component that alerts if you click outside of it
 */

interface IOutsideAlerterProps {
  fn: () => void;
}
const OutsideAlerter: React.FC<IOutsideAlerterProps> = ({ children, fn }) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, fn);

  return <div ref={wrapperRef}>{children}</div>;
};

export default OutsideAlerter;
