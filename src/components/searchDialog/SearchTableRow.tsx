import { memo } from 'react';
import { Lecture } from '../../types';
import useAutoCallback from '../../hooks/useAutoCallback';

interface SearchTableRowProps extends Lecture {
  onClick: (lecture: Lecture) => void;
}

const SearchTableRow = memo(
  ({ onClick, ...lecture }: SearchTableRowProps) => {
    const handleClick = useAutoCallback(() => onClick(lecture));
    return (
      <tr>
        <td className="w-100px">{lecture.id}</td>
        <td className="w-50px">{lecture.grade}</td>
        <td className="w-200px">{lecture.title}</td>
        <td className="w-50px">{lecture.credits}</td>
        <td
          className="w-150px"
          dangerouslySetInnerHTML={{ __html: lecture.major }}
        />
        <td
          className="w-150px"
          dangerouslySetInnerHTML={{ __html: lecture.schedule }}
        />
        <td style={{ width: '80px' }}>
          <button className="chakra-button add-button" onClick={handleClick}>
            추가
          </button>
        </td>
      </tr>
    );
  },
  (prevProps, nextProps) => {
    // lecture.id가 같으면 같은 데이터로 간주
    return prevProps.id === nextProps.id;
  },
);

export default SearchTableRow;
