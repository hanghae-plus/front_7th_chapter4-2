import { memo } from "react";
import { Button, Td, Tr } from "@chakra-ui/react";
import { Lecture } from "../types/index.ts";

interface LectureRowProps {
  lecture: Lecture;
  onAdd: (lecture: Lecture) => void;
}

export const LectureRow = memo(({ lecture, onAdd }: LectureRowProps) => {
  return (
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
  );
});

LectureRow.displayName = "LectureRow";
