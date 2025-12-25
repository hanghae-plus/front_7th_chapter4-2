/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { createStore, useStore } from "./useStore";
import { usePrevious } from "./usePrevious";

type Query<T> = {
  key: string;
  fetcher: () => Promise<T>;
};

type FetchedDatas<
  T extends Array<Query<any>>,
  Result extends Array<any> = []
> = T extends [infer F, ...infer Rest extends Array<Query<any>>]
  ? F extends {
      key: string;
      fetcher: () => Promise<infer R>;
    }
    ? FetchedDatas<Rest, [R, ...Result]>
    : Result
  : Result;

export function useFetches<
  T extends Array<{
    key: string;
    fetcher: () => Promise<any>;
  }>
>(...queries: T) {
  const fetchCaches = useStore(fetchCachesStore);
  const previousFetchCaches = usePrevious(fetchCaches);
  const [data, setData] = useState<FetchedDatas<T> | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetch = (key: string, fetcher: () => Promise<any>) => {
    const promise = fetcher();
    fetchCaches[key] = promise;

    return promise.then((data) => {
      fetchCaches[key] = data;
      return data;
    });
  };

  useEffect(() => {
    setIsLoading(true);
    Promise.all(
      queries.map((query) => {
        if (fetchCaches[query.key] != null) {
          console.log(`${query.key} is cached`);
          return fetchCaches[query.key];
        }

        return fetch(query.key, query.fetcher);
      })
    )
      .then((data) => setData(data as FetchedDatas<T>))
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const deletedEntries = Object.entries(previousFetchCaches).filter(
      ([key]) => !fetchCaches[key]
    );
    deletedEntries.forEach(async ([key, fetcher]) => {
      const data = await fetch(key, fetcher);
      setData((prev) => {
        const newData = [...(prev ?? [])] as FetchedDatas<T>;
        const index = newData.findIndex((item) => item.key === key);
        if (index !== -1) {
          newData[index] = data;
        } else {
          (newData as any[]).push({ key, data });
        }
        return newData;
      });
    });
  }, [fetchCaches, previousFetchCaches]);

  return { data, error, isLoading };
}

export function query<T extends () => Promise<any>>(key: string, fetcher: T) {
  return {
    key,
    fetcher,
  };
}

export function invalidateQuery(key: string) {
  fetchCachesStore.setState((state) => {
    delete state[key];
    return state;
  });
}

const fetchCachesStore = createStore<Record<string, any>>({});
