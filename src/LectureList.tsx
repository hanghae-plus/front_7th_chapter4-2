import { memo, RefObject } from "react";
import {
  Box,
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Lecture } from "./types";

const LectureItem = memo(
  ({
    onClick,
    ...lecture
  }: { onClick: (lecture: Lecture) => void } & Lecture) => {
    const handleClick = () => onClick(lecture);
    return (
      <Tr>
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
          <Button size="sm" colorScheme="green" onClick={handleClick}>
            추가
          </Button>
        </Td>
      </Tr>
    );
  }
);

interface Props {
  lectures: Lecture[];
  onAdd: (lecture: Lecture) => void;
  loaderRef: RefObject<HTMLDivElement>;
  loaderWrapperRef: RefObject<HTMLDivElement>;
}

const LectureList = ({ lectures, onAdd, loaderRef, loaderWrapperRef }: Props) => {
  return (
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
            {lectures.map((lecture, index) => (
              <LectureItem
                key={`${lecture.id}-${index}`}
                {...lecture}
                onClick={onAdd}
              />
            ))}
          </Tbody>
        </Table>
        <Box ref={loaderRef} h="20px" />
      </Box>
    </Box>
  );
};

export default memo(LectureList);