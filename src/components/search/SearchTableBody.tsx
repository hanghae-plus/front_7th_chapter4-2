import { Box, Table, Tbody } from '@chakra-ui/react';
import { memo } from 'react';
import { Lecture } from '../../types/search';
import SearchItem from './SearchItem';

interface SearchTableBodyProps {
  visibleLectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
  loaderWrapperRef: React.RefObject<HTMLDivElement | null>;
  loaderRef: React.RefObject<HTMLDivElement | null>;
}

const SearchTableBody = memo(
  ({ visibleLectures, onAddSchedule, loaderWrapperRef, loaderRef }: SearchTableBodyProps) => (
    <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
      <Table size="sm" variant="striped">
        <Tbody>
          {visibleLectures.map((lecture, index) => (
            <SearchItem key={`${lecture.id}-${index}`} onClick={onAddSchedule} {...lecture} />
          ))}
        </Tbody>
      </Table>
      <Box ref={loaderRef} h="20px" />
    </Box>
  ),
);

export default SearchTableBody;
