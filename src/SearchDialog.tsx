import { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import { useLectures } from "./hooks/useLectures.ts";
import { useFilteredLectures } from "./hooks/useFilteredLectures.ts";
import { SearchOption } from "./utils/filterLectures.ts";
import SearchFilters from "./components/SearchDialog/SearchFilters.tsx";
import LectureTable from "./components/SearchDialog/LectureTable.tsx";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { schedulesMap, setSchedules } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);

  // 강의 데이터를 가져오는 커스텀 훅 사용 (캐시 포함)
  const { lectures } = useLectures();

  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // 필터링 및 페이지네이션을 처리하는 커스텀 훅 사용
  const { filteredLectures, visibleLectures, allMajors, lastPage } =
    useFilteredLectures({
      lectures,
      searchOptions,
      page,
    });

  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleScrollToTop = useCallback(() => {
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;

      const newSchedules = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));

      // 해당 시간표만 독립적으로 업데이트
      const currentSchedules = schedulesMap[tableId] || [];
      setSchedules(tableId, [...currentSchedules, ...newSchedules]);

      onClose();
    },
    [searchInfo, schedulesMap, setSchedules, onClose]
  );

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }));
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <SearchFilters
              searchOptions={searchOptions}
              allMajors={allMajors}
              onChange={changeSearchOption}
              onScrollToTop={handleScrollToTop}
            />
            <LectureTable
              filteredLectures={filteredLectures}
              visibleLectures={visibleLectures}
              page={page}
              lastPage={lastPage}
              onPageChange={handlePageChange}
              onAddSchedule={addSchedule}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

// React.memo로 컴포넌트 메모이제이션하여 불필요한 리렌더링 방지
export default memo(SearchDialog, (prevProps, nextProps) => {
  // searchInfo가 변경되지 않았으면 리렌더링 방지
  if (
    prevProps.searchInfo === nextProps.searchInfo &&
    prevProps.onClose === nextProps.onClose
  ) {
    return true; // props가 같으면 리렌더링 안 함
  }
  return false; // props가 다르면 리렌더링
});
