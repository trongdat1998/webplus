import React, { useEffect, useRef } from "react";

const useInterval = (callback, start, intervalPeriod) => {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = () => savedCallback.current();
    if (start) {
      const id = setInterval(handler, intervalPeriod);
      return () => clearInterval(id);
    }
  }, [start, intervalPeriod]);
};

export default useInterval;
