export const createCachedFetch = <T>(fetchFn: () => Promise<T>) => {
  let cache: T | null = null;
  let pendingPromise: Promise<T> | null = null;
  return async (): Promise<T> => {
    if (cache) {
      console.log("캐시 사용");
      return cache;
    }
    if (pendingPromise) {
      console.log("진행 중인 요청 재사용");
      return pendingPromise;
    }

    console.log("실제 API 호출");
    pendingPromise = fetchFn();
    cache = await pendingPromise;
    pendingPromise = null;
    return cache;
  };
};
