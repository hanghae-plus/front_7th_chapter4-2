import { memo } from "react";
import { Td, Tr, Button } from "@chakra-ui/react";
import { Lecture } from "../../types.ts";

interface LectureRowProps {
  lecture: Lecture;
  index: number;
  onAddSchedule: (lecture: Lecture) => void;
}

/**
 * 강의 목록의 각 행을 렌더링하는 컴포넌트
 * React.memo로 메모이제이션하여 lecture나 onAddSchedule이 변경되지 않으면 리렌더링하지 않음
 */
const LectureRow = memo(
  ({ lecture, index, onAddSchedule }: LectureRowProps) => {
    return (
      <Tr key={`${lecture.id}-${index}`}>
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
          <Button
            size="sm"
            colorScheme="blackAlpha"
            bg="blackAlpha.900"
            color="white"
            _hover={{ bg: "blackAlpha.800" }}
            onClick={() => onAddSchedule(lecture)}
          >
            추가
          </Button>
        </Td>
      </Tr>
    );
  },
  (prevProps, nextProps) => {
    // lecture 객체와 onAddSchedule 참조가 같으면 리렌더링 안 함
    return (
      prevProps.lecture === nextProps.lecture &&
      prevProps.onAddSchedule === nextProps.onAddSchedule &&
      prevProps.index === nextProps.index
    );
  }
);

export default LectureRow;
