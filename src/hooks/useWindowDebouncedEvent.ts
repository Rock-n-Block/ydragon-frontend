import { useEffect, useState } from 'react';
import useDebounce from './useDebounce';

/**
 * Hook aply `func` with debounce at `listeningEvent`
 * @param listeningEvent - Window event like 'resize'
 * @param observedState - Window state like 'window.innerWidth'
 * @param func - Function that should apply after window event
 * @param delay
 */
const useWindowDebouncedEvent = <T>(
  listeningEvent: string,
  observedState: T,
  func: (arg: T) => void,
  delay: number,
) => {
  const [state, setState] = useState<T>(observedState);
  const debouncedValue = useDebounce(state, delay);

  useEffect(() => {
    const handler = () => {
      setState(observedState);
    };
    window.addEventListener(listeningEvent, handler);
    return () => window.removeEventListener(listeningEvent, handler);
  }, [observedState, listeningEvent]);

  useEffect(() => {
    func(debouncedValue);
  }, [debouncedValue, func]);
};
export default useWindowDebouncedEvent;
