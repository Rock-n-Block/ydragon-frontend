import { useCallback, useEffect, useState } from 'react';

const UseIsHeaderBackground = (scrollYAmount: number): boolean => {
  const [isHeaderBackground, setIsHeaderBackground] = useState<boolean>(false);

  const [scrollY, setScrollY] = useState<number>(0);

  const logIt = useCallback(() => {
    setScrollY(window.pageYOffset);
    if (scrollY > scrollYAmount) {
      setIsHeaderBackground(true);
    } else setIsHeaderBackground(false);
  }, [scrollY, scrollYAmount]);

  useEffect(() => {
    const watchScroll = () => {
      window.addEventListener('scroll', logIt);
    };
    watchScroll();
    return () => {
      window.removeEventListener('scroll', logIt);
    };
  });
  return isHeaderBackground;
};

export default UseIsHeaderBackground;
