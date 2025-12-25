import { useEffect, useRef, useState } from "react";

import { Box, Table, Tbody } from "@chakra-ui/react";
import { Lecture } from "../types";
import { LectureListItem } from "./LectureListItem";

const PAGE_SIZE = 100;

export function LectureList({
  lectures,
  onLectureClick,
}: {
  lectures: Lecture[];
  onLectureClick: (lecture: Lecture) => void;
}) {
  const loaderRef = useRef<HTMLDivElement>(null);
  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  const lastPage = Math.ceil(lectures.length / PAGE_SIZE);
  const visibleLectures = lectures.slice(0, page * PAGE_SIZE);

  // lectures가 변경되면 페이지를 1로 리셋 (검색 옵션 변경 시)
  useEffect(() => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, [lectures]);

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
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  return (
    <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
      <Table size="sm" variant="striped">
        <Tbody>
          {visibleLectures.map((lecture, index) => (
            <LectureListItem
              key={`${lecture.id}-${index}`}
              lecture={lecture}
              onClick={onLectureClick}
            />
          ))}
        </Tbody>
      </Table>
      <Box ref={loaderRef} h="20px" />
    </Box>
  );
}
