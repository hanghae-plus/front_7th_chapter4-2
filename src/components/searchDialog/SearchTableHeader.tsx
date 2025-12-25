import { memo } from 'react';

const SearchTableHeader = memo(() => {
  return (
    <table className="chakra-table table">
      <thead className="search-table-header">
        <tr>
          <th className="w-100px">학수번호</th>
          <th className="w-50px">학년</th>
          <th className="w-200px">교과목명</th>
          <th className="w-50px">학점</th>
          <th className="w-150px">개설학과</th>
          <th className="w-150px">시간표</th>
          <th className="w-80px">추가</th>
        </tr>
      </thead>
    </table>
  );
});

export default SearchTableHeader;
