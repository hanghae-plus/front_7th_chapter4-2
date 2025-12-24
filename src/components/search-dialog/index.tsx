import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { fetchAllLectures } from '../../api/lectures.ts';
import { useSetAtom } from 'jotai';
import { getScheduleAtom } from '../../store/scheduleAtoms';
import { CREDITS, DAY_LABELS, GRADES, TIME_SLOTS } from '../../constants';
import { Lecture, SearchOption } from '../../types.ts';
import { parseSchedule } from '../../utils.ts';
import { LecturesTable } from './LecturesTable.tsx';
import { CreditControl } from './form/CreditControl.tsx';
import { DayControl } from './form/DayControl.tsx';
import { GradeControl } from './form/GradeControl.tsx';
import { MajorControl } from './form/MajorControl.tsx';
import { QueryControl } from './form/QueryControl.tsx';
import { TimeControl } from './form/TimeControl.tsx';

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

const PAGE_SIZE = 100;

const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const setSchedules = useSetAtom(getScheduleAtom(searchInfo?.tableId ?? ''));

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // searchInfo에서 초기값 계산
  const [initialDays] = useState(() => (searchInfo?.day ? [searchInfo.day] : []));
  const [initialTimes] = useState(() => (searchInfo?.time ? [searchInfo.time] : []));

  const filteredLectures = useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;
    return lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase()),
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => s.range.some((time) => times.includes(time)));
      });
  }, [lectures, searchOptions]);

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = useMemo(() => filteredLectures.slice(0, page * PAGE_SIZE), [filteredLectures, page]);
  const allMajors = useMemo(() => [...new Set(lectures.map((lecture) => lecture.major))], [lectures]);

  const handleFormChange = useCallback((value: Partial<SearchOption>) => {
    setPage(1);
    setSearchOptions((prev) => ({ ...prev, ...value }));
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, []);

  const handleQueryChange = useCallback((query: string) => handleFormChange({ query }), [handleFormChange]);
  const handleCreditsChange = useCallback((credits: number) => handleFormChange({ credits }), [handleFormChange]);
  const handleGradesChange = useCallback((grades: number[]) => handleFormChange({ grades }), [handleFormChange]);
  const handleDaysChange = useCallback((days: string[]) => handleFormChange({ days }), [handleFormChange]);
  const handleTimesChange = useCallback((times: number[]) => handleFormChange({ times }), [handleFormChange]);
  const handleMajorsChange = useCallback((majors: string[]) => handleFormChange({ majors }), [handleFormChange]);

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));

      setSchedules((prev) => [...prev, ...schedules]);

      onClose();
    },
    [onClose, searchInfo, setSchedules],
  );

  useEffect(() => {
    fetchAllLectures().then(setLectures);
  }, []);

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

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <QueryControl onChange={handleQueryChange} />
              <CreditControl allCredits={CREDITS} onChange={handleCreditsChange} />
            </HStack>

            <HStack spacing={4}>
              <GradeControl allGrades={GRADES} onChange={handleGradesChange} />
              <DayControl allDays={DAY_LABELS} initialValue={initialDays} onChange={handleDaysChange} />
            </HStack>

            <HStack spacing={4}>
              <TimeControl allTimes={TIME_SLOTS} initialValue={initialTimes} onChange={handleTimesChange} />
              <MajorControl allMajors={allMajors} onChange={handleMajorsChange} />
            </HStack>
            <Text align="right">검색결과: {filteredLectures.length}개</Text>
            <Box>
              <Table>
                <Thead>
                  <Tr>
                    <Th width="100px">과목코드</Th>
                    <Th width="50px">학년</Th>
                    <Th width="200px">과목명</Th>
                    <Th width="50px">학점</Th>
                    <Th width="150px">전공</Th>
                    <Th width="150px">시간</Th>
                    <Th width="80px"></Th>
                  </Tr>
                </Thead>
              </Table>

              <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                <LecturesTable lectures={visibleLectures} onClick={addSchedule} />
                <Box ref={loaderRef} h="20px" />
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;
