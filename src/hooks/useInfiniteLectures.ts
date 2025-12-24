import { useRef, useState } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

interface UseInfiniteLecturesProps<T> {
  items: T[];
}

const PAGE_SIZE = 100;

export const useInfiniteLectures = <T>(props: UseInfiniteLecturesProps<T>) => {
  const { items: originItems } = props;

  const [page, setPage] = useState(1);
  const ref = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const lastPage = Math.ceil(originItems.length / PAGE_SIZE);

  const items = originItems.slice(0, page * PAGE_SIZE);

  const reset = () => {
    setPage(1);
    wrapperRef.current?.scrollTo(0, 0);
  };

  useIntersectionObserver({
    ref,
    options: { root: wrapperRef.current },
    onIntersect: ([entry]) => {
      const $loader = ref.current;
      const $loaderWrapper = wrapperRef.current;

      if (!$loader || !$loaderWrapper) {
        return;
      }

      if (entry.isIntersecting) {
        setPage((prevPage) => Math.min(lastPage, prevPage + 1));
      }
    },
  });

  return { items, ref, wrapperRef, reset };
};
