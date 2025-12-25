import { useCallback, useRef } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useAutoCallback = <T extends (...args: any[]) => any>(callback: T): T => {
  const callbackRef = useRef<T>(callback);
  callbackRef.current = callback;

  return useCallback(
    (...args: Parameters<T>) => callbackRef.current?.(...args),
    [],
  ) as T;
};

export default useAutoCallback;
