import { memo } from 'react';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useScheduleContext } from '../../context';
import { Lecture } from '../../types.ts';
import { parseSchedule } from '../../utils.ts';
import useAutoCallback from '../../hooks/useAutoCallback';
import useLectures from '../../hooks/useLectures';
import useSearchOptions, { SearchOption } from '../../hooks/useSearchOptions';
import useLectureFilter from '../../hooks/useLectureFilter';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';
import SearchTable from './SearchTable.tsx';
import SearchFilters from './SearchFilters.tsx';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  // 커스텀 훅 조합
  const { lectures, allMajors } = useLectures();
  const { searchOptions, changeOption } = useSearchOptions(searchInfo);
  const { filteredLectures, totalCount } = useLectureFilter(
    lectures,
    searchOptions,
  );
  const { visibleItems, loaderWrapperRef, loaderRef, resetPage } =
    useInfiniteScroll(filteredLectures);

  // 옵션 변경 시 페이지 리셋
  const handleChangeOption = useAutoCallback(
    (field: keyof SearchOption, value: SearchOption[keyof SearchOption]) => {
      changeOption(field, value);
      resetPage();
    },
  );

  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap((prev) => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onClose();
  });

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
              onChangeOption={handleChangeOption}
            />
            <Text align="right">검색결과: {totalCount}개</Text>
            <SearchTable
              loaderWrapperRef={loaderWrapperRef}
              loaderRef={loaderRef}
              visibleLectures={visibleItems}
              onAddSchedule={addSchedule}
            />
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default SearchDialog;
