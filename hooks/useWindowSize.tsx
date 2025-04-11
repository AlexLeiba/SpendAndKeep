import React, { useEffect } from 'react';

export function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    function handleWindowResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    handleWindowResize();

    window.addEventListener('resize', () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    });

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return [windowSize.width, windowSize.height];
}
