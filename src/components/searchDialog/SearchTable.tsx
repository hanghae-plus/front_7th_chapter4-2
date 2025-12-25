import { Box } from '@chakra-ui/react';
import { memo } from 'react';
import SearchTableHeader from './SearchTableHeader';
import SearchTableBody from './SearchTableBody';
import './SearchTable.css';
import { Lecture } from '../../types';

interface SearchTableProps {
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
  visibleLectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
}

const SearchTable = memo(
  ({
    loaderWrapperRef,
    loaderRef,
    visibleLectures,
    onAddSchedule,
  }: SearchTableProps) => {
    return (
      <Box>
        <SearchTableHeader />
        <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
          <SearchTableBody
            lectures={visibleLectures}
            onAddSchedule={onAddSchedule}
          />

          <Box ref={loaderRef} h="20px" />
        </Box>
      </Box>
    );
  },
  (prevProps, nextProps) => {
    // visibleLectures 길이와 첫/마지막 항목 비교로 빠르게 판단
    if (prevProps.visibleLectures.length !== nextProps.visibleLectures.length) {
      return false;
    }
    // 같은 길이면 첫 번째와 마지막 id로 비교
    const prevFirst = prevProps.visibleLectures[0]?.id;
    const nextFirst = nextProps.visibleLectures[0]?.id;
    const prevLast =
      prevProps.visibleLectures[prevProps.visibleLectures.length - 1]?.id;
    const nextLast =
      nextProps.visibleLectures[nextProps.visibleLectures.length - 1]?.id;
    return prevFirst === nextFirst && prevLast === nextLast;
  },
);

export default SearchTable;
