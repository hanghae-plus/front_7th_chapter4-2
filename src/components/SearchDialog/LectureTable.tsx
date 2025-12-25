import { memo, useEffect, useRef } from "react";
import { Box, Table, Tbody, Text } from "@chakra-ui/react";
import { Lecture } from "../../types.ts";
import LectureRow from "./LectureRow.tsx";
import LectureTableHeader from "./LectureTableHeader.tsx";

interface LectureTableProps {
  filteredLectures: Lecture[];
  visibleLectures: Lecture[];
  page: number;
  lastPage: number;
  onPageChange: (page: number) => void;
  onAddSchedule: (lecture: Lecture) => void;
}

/**
 * 강의 목록 테이블 컴포넌트
 * React.memo로 메모이제이션하여 visibleLectures나 onAddSchedule이 변경되지 않으면 리렌더링하지 않음
 */
const LectureTable = memo(
  ({
    filteredLectures,
    visibleLectures,
    page,
    lastPage,
    onPageChange,
    onAddSchedule,
  }: LectureTableProps) => {
    const loaderWrapperRef = useRef<HTMLDivElement>(null);
    const loaderRef = useRef<HTMLDivElement>(null);

    // 무한 스크롤 구현
    useEffect(() => {
      const $loader = loaderRef.current;
      const $loaderWrapper = loaderWrapperRef.current;

      if (!$loader || !$loaderWrapper) {
        return;
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onPageChange(Math.min(lastPage, page + 1));
          }
        },
        { threshold: 0, root: $loaderWrapper }
      );

      observer.observe($loader);

      return () => observer.unobserve($loader);
    }, [page, lastPage, onPageChange]);

    return (
      <>
        <Text align="right">검색결과: {filteredLectures.length}개</Text>
        <Box>
          <LectureTableHeader />

          <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
            <Table size="sm" variant="striped">
              <Tbody>
                {visibleLectures.map((lecture, index) => (
                  <LectureRow
                    key={`${lecture.id}-${index}`}
                    lecture={lecture}
                    index={index}
                    onAddSchedule={onAddSchedule}
                  />
                ))}
              </Tbody>
            </Table>
            <Box ref={loaderRef} h="20px" />
          </Box>
        </Box>
      </>
    );
  },
  (prevProps, nextProps) => {
    // visibleLectures와 onAddSchedule이 변경되지 않았으면 리렌더링 안 함
    // filteredLectures.length는 검색 결과 개수 표시에만 사용되므로 참조 비교
    return (
      prevProps.visibleLectures === nextProps.visibleLectures &&
      prevProps.filteredLectures.length === nextProps.filteredLectures.length &&
      prevProps.onAddSchedule === nextProps.onAddSchedule &&
      prevProps.page === nextProps.page &&
      prevProps.lastPage === nextProps.lastPage &&
      prevProps.onPageChange === nextProps.onPageChange
    );
  }
);

export default LectureTable;
