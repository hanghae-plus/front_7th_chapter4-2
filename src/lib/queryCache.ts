type CacheEntry<T> = {
  promise: Promise<T>;
  status: 'pending' | 'success' | 'error';
};

export const createQueryCache = () => {
  const cache = new Map<string, CacheEntry<unknown>>();

  return {
    /**
     * 데이터를 가져옵니다. 캐시가 있으면 캐시를 반환합니다.
     */
    fetch: <T>(key: string, fetchFn: () => Promise<T>): Promise<T> => {
      const existing = cache.get(key) as CacheEntry<T> | undefined;

      // 캐시 히트: 에러가 아니면 재사용
      if (existing && existing.status !== 'error') {
        return existing.promise;
      }

      // 캐시 미스: 새로 fetch
      const promise = fetchFn()
        .then((data) => {
          const entry = cache.get(key);
          if (entry) entry.status = 'success';
          return data;
        })
        .catch((error) => {
          const entry = cache.get(key);
          if (entry) entry.status = 'error';
          throw error;
        });

      cache.set(key, {
        promise,
        status: 'pending',
      });

      return promise;
    },

    /**
     * 특정 키 또는 전체 캐시를 무효화합니다.
     */
    invalidate: (key?: string) => {
      if (key) {
        cache.delete(key);
      } else {
        cache.clear();
      }
    },

    /**
     * 캐시 상태를 조회합니다 (디버깅용).
     */
    getStatus: (key: string) => cache.get(key)?.status,
  };
};
