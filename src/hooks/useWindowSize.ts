import { useState, useEffect } from 'react';

// interface for window size state
interface WindowSize {
  width: number | undefined;
  height: number | undefined;
}

export function useWindowSize(): WindowSize {
  // init state with undefined so we know its not ready yet
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: undefined,
    height: undefined,
  });

  // let's do some magic
  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // add the listener
    window.addEventListener('resize', handleResize);

    // lets set the initial values
    handleResize();

    // cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}