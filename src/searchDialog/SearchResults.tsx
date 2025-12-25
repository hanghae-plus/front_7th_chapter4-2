import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import { useSearchOptions } from '../SearchOptionsContext';
import { useSetSchedulesMap } from '../ScheduleContext';
import { useSearchInfo, useSetSearchInfo } from '../SearchInfoContext';
import { Lecture } from '../types';
import { parseSchedule } from '../utils';

const PAGE_SIZE = 100;

interface SearchResultsProps {
  lectures: Lecture[];
}

interface LectureRowProps {
  lecture: Lecture;
  onAdd: (lecture: Lecture) => void;
}

const LectureRow = memo(({ lecture, onAdd }: LectureRowProps) => (
  <Tr>
    <Td width="100px">{lecture.id}</Td>
    <Td width="50px">{lecture.grade}</Td>
    <Td width="200px">{lecture.title}</Td>
    <Td width="50px">{lecture.credits}</Td>
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
    <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }} />
    <Td width="80px">
      <Button size="sm" colorScheme="green" onClick={() => onAdd(lecture)}>
        추가
      </Button>
    </Td>
  </Tr>
));

const getFilteredLectures = (
  lectures: Lecture[],
  searchOptions: {
    query?: string;
    credits?: number;
    grades: number[];
    days: string[];
    times: number[];
    majors: string[];
  }
) => {
  const { query = '', credits, grades, days, times, majors } = searchOptions;
  return lectures
    .filter(
      lecture =>
        lecture.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture.id.toLowerCase().includes(query.toLowerCase())
    )
    .filter(lecture => grades.length === 0 || grades.includes(lecture.grade))
    .filter(lecture => majors.length === 0 || majors.includes(lecture.major))
    .filter(lecture => !credits || lecture.credits.startsWith(String(credits)))
    .filter(lecture => {
      if (days.length === 0) {
        return true;
      }
      const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
      return schedules.some(s => days.includes(s.day));
    })
    .filter(lecture => {
      if (times.length === 0) {
        return true;
      }
      const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
      return schedules.some(s => s.range.some(time => times.includes(time)));
    });
};

export const SearchResults = memo(({ lectures }: SearchResultsProps) => {
  const searchOptions = useSearchOptions();
  const searchInfo = useSearchInfo();
  const setSearchInfo = useSetSearchInfo();
  const setSchedulesMap = useSetSchedulesMap();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);

  // DEBUG: searchOptions 변경 확인
  console.log('SearchResults render - searchOptions:', searchOptions);

  const filteredLectures = useMemo(
    () => getFilteredLectures(lectures, searchOptions),
    [lectures, searchOptions]
  );

  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);

  const addSchedule = (lecture: Lecture) => {
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

    setSearchInfo(null);
  };

  // searchOptions 변경 시 페이지 초기화 및 스크롤 초기화
  useEffect(() => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, [searchOptions]);

  // 무한 스크롤
  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  return (
    <>
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
          <Table size="sm" variant="striped">
            <Tbody>
              {visibleLectures.map((lecture, index) => (
                <LectureRow
                  key={`${lecture.id}- ${index}`}
                  lecture={lecture}
                  onAdd={addSchedule}
                />
              ))}
            </Tbody>
          </Table>
          <Box ref={loaderRef} h="20px" />
        </Box>
      </Box>
    </>
  );
});

// TODO: ROW도 렌더링됨 큰 덩어리만 렌더링되어야함
