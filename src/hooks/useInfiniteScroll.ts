import { useEffect, useMemo, useRef, useState } from 'react';
import useAutoCallback from './useAutoCallback';

interface UseInfiniteScrollReturn<T> {
  visibleItems: T[];
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  resetPage: () => void;
}

const useInfiniteScroll = <T>(
  items: T[],
  pageSize: number = 100,
): UseInfiniteScrollReturn<T> => {
  const [page, setPage] = useState(1);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const lastPage = Math.ceil(items.length / pageSize);

  const visibleItems = useMemo(
    () => items.slice(0, page * pageSize),
    [items, page, pageSize],
  );

  const resetPage = useAutoCallback(() => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  });

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper },
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  return {
    visibleItems,
    loaderWrapperRef,
    loaderRef,
    resetPage,
  };
};

export default useInfiniteScroll;
