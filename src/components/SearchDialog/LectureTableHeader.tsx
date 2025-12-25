import { memo } from "react";
import { Th, Thead, Tr, Table } from "@chakra-ui/react";

/**
 * 강의 목록 테이블의 헤더 컴포넌트
 * React.memo로 메모이제이션하여 불필요한 리렌더링 방지
 */
const LectureTableHeader = memo(() => {
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

export default LectureTableHeader;
