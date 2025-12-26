import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from '@chakra-ui/react';
import { memo, useEffect, useMemo, useState } from 'react';
import { useScheduleAction } from '../../contexts/ScheduleContext.ts';
import useAutoCallback from '../../hooks/useAutoCallback.ts';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll.ts';
import { useSearchOptions } from '../../hooks/useSearchOptions.ts';
import { fetchAllLectures } from '../../services/lectureService.ts';
import { Lecture } from '../../types/search.ts';
import { parseSchedule } from '../../utils/schedule.ts';
import { filterLectures } from '../../utils/search.ts';
import {
  CreditsSelect,
  DaysCheckboxes,
  GradesCheckboxes,
  MajorsCheckboxes,
  QueryInput,
  TimesCheckboxes,
} from './SearchFormControls.tsx';
import SearchTableBody from './SearchTableBody.tsx';
import SearchTableHeader from './SearchTableHeader.tsx';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const SearchDialog = memo(({ searchInfo, onClose }: Props) => {
  const setSchedulesMap = useScheduleAction();
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const { searchOptions, handleChange } = useSearchOptions({
    initialDay: searchInfo?.day,
    initialTime: searchInfo?.time,
  });
  const filteredLectures = useMemo(
    () => filterLectures(lectures, searchOptions),
    [lectures, searchOptions],
  );
  const { loaderWrapperRef, loaderRef, visibleCount, resetPage } = useInfiniteScroll({
    totalItems: filteredLectures.length,
  });

  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, visibleCount),
    [filteredLectures, visibleCount],
  );
  const allMajors = useMemo(() => [...new Set(lectures.map(lecture => lecture.major))], [lectures]);

  const addSchedule = useAutoCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture,
    }));

    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules],
    }));

    onClose();
  });
  const handleOptionChange = useAutoCallback(resetPage);

  useEffect(() => {
    handleOptionChange();
  }, [searchOptions, handleOptionChange]);

  useEffect(() => {
    if (!searchInfo) return;

    const start = performance.now();
    console.log('API 호출 시작: ', start);
    fetchAllLectures().then(lectures => {
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end);
      console.log('API 호출에 걸린 시간(ms): ', end - start);
      setLectures(lectures);
    });
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <QueryInput value={searchOptions.query} onChange={handleChange.query} />
              <CreditsSelect value={searchOptions.credits} onChange={handleChange.credits} />
            </HStack>
            <HStack spacing={4}>
              <GradesCheckboxes value={searchOptions.grades} onChange={handleChange.grades} />
              <DaysCheckboxes value={searchOptions.days} onChange={handleChange.days} />
            </HStack>
            <HStack spacing={4}>
              <TimesCheckboxes value={searchOptions.times} onChange={handleChange.times} />
              <MajorsCheckboxes
                value={searchOptions.majors}
                onChange={handleChange.majors}
                items={allMajors}
              />
            </HStack>
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <SearchTableHeader />
              <SearchTableBody
                visibleLectures={visibleLectures}
                onAddSchedule={addSchedule}
                loaderWrapperRef={loaderWrapperRef}
                loaderRef={loaderRef}
              />
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
});

export default SearchDialog;
