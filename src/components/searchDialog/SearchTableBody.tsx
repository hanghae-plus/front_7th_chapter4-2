import { memo } from 'react';
import { Lecture } from '../../types';
import SearchTableRow from './SearchTableRow';

interface SearchTableBodyProps {
  lectures: Lecture[];
  onAddSchedule: (lecture: Lecture) => void;
}

const SearchTableBody = memo(
  ({ lectures, onAddSchedule }: SearchTableBodyProps) => {
    return (
      <table className="chakra-table table">
        <tbody className="search-table-body">
          {lectures.map((lecture, index) => (
            <SearchTableRow
              key={`${lecture.id}-${index}`}
              {...lecture}
              onClick={onAddSchedule}
            />
          ))}
        </tbody>
      </table>
    );
  },
  (prevProps, nextProps) => {
    // 길이가 다르면 리렌더
    if (prevProps.lectures.length !== nextProps.lectures.length) {
      return false;
    }
    // 모든 lecture의 id가 같은지 비교
    return prevProps.lectures.every(
      (lecture, index) => lecture.id === nextProps.lectures[index]?.id,
    );
  },
);

export default SearchTableBody;
