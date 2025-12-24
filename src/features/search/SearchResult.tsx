import { memo, useCallback, useEffect, useMemo, useRef } from 'react';
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
import { useVirtualizer } from '@tanstack/react-virtual';
import { Lecture, SearchInfo, SearchOption } from '../../types.ts';
import { filterLectures } from './services/lectureFilterService.ts';
import { useScheduleStore } from '../schedules/store/scheduleStore.ts';

const ROW_HEIGHT = 40;

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
  const addScheduleToStore = useScheduleStore((state) => state.addSchedule);

  const filteredLectures = useMemo(
    () => filterLectures(lectures, searchOptions),
    [lectures, searchOptions],
  );

  const addSchedule = useCallback(
    (lecture: Lecture) => {
      if (!searchInfo) return;

      const { tableId } = searchInfo;
      addScheduleToStore(tableId, lecture);
      onClose();
    },
    [searchInfo, addScheduleToStore, onClose],
  );

  return (
    <>
      <Text align="right">검색결과: {filteredLectures.length}개</Text>
      <Box>
        <TableHead />
        <LectureTable
          filteredLectures={filteredLectures}
          addSchedule={addSchedule}
          searchOptions={searchOptions}
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
  addSchedule,
  searchOptions,
}: {
  filteredLectures: Lecture[];
  addSchedule: (lecture: Lecture) => void;
  searchOptions: SearchOption;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: filteredLectures.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 5,
  });

  useEffect(() => {
    virtualizer.scrollToIndex(0);
  }, [searchOptions, virtualizer]);

  return (
    <Box ref={parentRef} overflowY="auto" maxH="500px">
      <Table size="sm">
        <Tbody>
          <Tr h={`${virtualizer.getVirtualItems()[0]?.start ?? 0}px`} />
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <LectureRow
              key={virtualItem.index}
              lecture={filteredLectures[virtualItem.index]}
              index={virtualItem.index}
              onAdd={addSchedule}
            />
          ))}
          <Tr
            h={`${
              virtualizer.getTotalSize() -
              (virtualizer.getVirtualItems().at(-1)?.end ?? 0)
            }px`}
          />
        </Tbody>
      </Table>
    </Box>
  );
};

const LectureRow = memo(
  ({
    lecture,
    index,
    onAdd,
  }: {
    lecture: Lecture;
    index: number;
    onAdd: (lecture: Lecture) => void;
  }) => {
    return (
      <Tr h={`${ROW_HEIGHT}px`} bg={index % 2 === 1 ? 'gray.50' : 'white'}>
        <Td width="100px">{lecture.id}</Td>
        <Td width="50px">{lecture.grade}</Td>
        <Td width="200px">{lecture.title}</Td>
        <Td width="50px">{lecture.credits}</Td>
        <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }} />
        <Td
          width="150px"
          dangerouslySetInnerHTML={{ __html: lecture.schedule }}
        />
        <Td width="80px">
          <Button size="sm" colorScheme="green" onClick={() => onAdd(lecture)}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  },
);
