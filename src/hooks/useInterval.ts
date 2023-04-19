import { useEffect, useRef } from 'react';

const useInterval = (callback: Function, delay?: number | null) => {
  const savedCallback = useRef<Function>();
  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    if (delay !== null) {
      const interval = setInterval(() => {
        if (savedCallback.current) savedCallback.current();
      }, delay);

      return () => clearInterval(interval);
    }
  }, [delay]);
};

export default useInterval;
