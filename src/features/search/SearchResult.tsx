import {
  memo,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { useScheduleContext } from '../schedules/ScheduleContext.tsx';
import { Lecture, SearchInfo, SearchOption } from '../../types.ts';
import { parseSchedule } from '../../utils.ts';
import { filterLectures } from './services/lectureFilterService.ts';

const PAGE_SIZE = 100;

interface Props {
  searchInfo: SearchInfo | null;
  lectures: Lecture[];
  searchOptions: SearchOption;
  onClose: () => void;
}

const SearchResult = ({
  searchInfo,
  lectures,
  searchOptions,
  onClose,
}: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [page, setPage] = useState(1);

  const filteredLectures = useMemo(
    () => filterLectures(lectures, searchOptions),
    [lectures, searchOptions],
  );
  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);

  const addSchedule = useCallback(
    (lecture: Lecture) => {
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
    },
    [searchInfo, setSchedulesMap, onClose],
  );

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

  useEffect(() => {
    setPage(1);
    loaderWrapperRef.current?.scrollTo(0, 0);
  }, [searchOptions]);

  return (
    <>
      <Text align="right">검색결과: {filteredLectures.length}개</Text>
      <Box>
        <TableHead />
        <LectureTable
          filteredLectures={filteredLectures}
          page={page}
          loaderWrapperRef={loaderWrapperRef}
          loaderRef={loaderRef}
          addSchedule={addSchedule}
        />
      </Box>
    </>
  );
};

export default SearchResult;

const TableHead = memo(() => {
  return (
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
  );
});

const LectureTable = ({
  filteredLectures,
  page,
  loaderWrapperRef,
  loaderRef,
  addSchedule,
}: {
  filteredLectures: Lecture[];
  page: number;
  loaderWrapperRef: RefObject<HTMLDivElement | null>;
  loaderRef: RefObject<HTMLDivElement | null>;
  addSchedule: (lecture: Lecture) => void;
}) => {
  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page],
  );

  return (
    <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
      <Table size="sm" variant="striped">
        <Tbody>
          {visibleLectures.map((lecture, index) => (
            <Tr key={`${lecture.id}-${index}`}>
              <Td width="100px">{lecture.id}</Td>
              <Td width="50px">{lecture.grade}</Td>
              <Td width="200px">{lecture.title}</Td>
              <Td width="50px">{lecture.credits}</Td>
              <Td
                width="150px"
                dangerouslySetInnerHTML={{ __html: lecture.major }}
              />
              <Td
                width="150px"
                dangerouslySetInnerHTML={{ __html: lecture.schedule }}
              />
              <Td width="80px">
                <Button
                  size="sm"
                  colorScheme="green"
                  onClick={() => addSchedule(lecture)}
                >
                  추가
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box ref={loaderRef} h="20px" />
    </Box>
  );
};
