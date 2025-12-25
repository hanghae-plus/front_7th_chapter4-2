import { memo, useState, useMemo } from 'react';
import { Flex } from '@chakra-ui/react';
import { useSchedulesMap } from '../../context';
import useAutoCallback from '../../hooks/useAutoCallback';
import ScheduleTableItem from './ScheduleTableItem';
import SearchDialog from '../searchDialog/SearchDialog';

interface SearchInfo {
  tableId: string;
  day?: string;
  time?: number;
}

const ScheduleTables = memo(() => {
  // schedulesMap 전체 구독 - 여기서만 State Context 구독!
  const schedulesMap = useSchedulesMap();

  // tableIds와 tableCount를 메모이제이션
  const tableIds = useMemo(() => Object.keys(schedulesMap), [schedulesMap]);
  const tableCount = tableIds.length;

  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  // 안정적인 콜백 - tableId를 인자로 받음 (인라인 함수 제거)
  const handleOpenSearch = useAutoCallback(
    (tableId: string, day?: string, time?: number) => {
      setSearchInfo({ tableId, day, time });
    },
  );

  const handleCloseDialog = useAutoCallback(() => {
    setSearchInfo(null);
  });

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableIds.map((tableId, index) => (
          <ScheduleTableItem
            key={tableId}
            tableId={tableId}
            schedules={schedulesMap[tableId]}
            index={index}
            disabledRemove={tableCount === 1}
            onOpenSearch={handleOpenSearch}
          />
        ))}
      </Flex>
      {searchInfo && (
        <SearchDialog searchInfo={searchInfo} onClose={handleCloseDialog} />
      )}
    </>
  );
});

export default ScheduleTables;
