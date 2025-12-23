import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import React, { useCallback, useMemo, useState } from "react";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const tableEntries = useMemo(() => Object.entries(schedulesMap), [schedulesMap]);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  

  // TableCard: 각 테이블 블록을 독립된 컴포넌트로 분리하여
  // 테이블별 콜백을 useCallback으로 고정시킵니다.
  const TableCard = React.memo(function TableCard({ tableId, schedules, index }: { tableId: string; schedules: any[]; index: number }) {
    const onOpenSearch = useCallback(() => setSearchInfo({ tableId }), [setSearchInfo, tableId]);
    const onScheduleTimeClick = useCallback((timeInfo: { day: string; time: number }) => setSearchInfo({ tableId, ...timeInfo }), [setSearchInfo, tableId]);
    const onDeleteButtonClick = useCallback(({ day, time }: { day: string; time: number }) => {
      setSchedulesMap(prev => ({
        ...prev,
        [tableId]: prev[tableId].filter(schedule => schedule.day !== day || !schedule.range.includes(time))
      }))
    }, [setSchedulesMap, tableId]);

    const duplicateTable = useCallback(() => {
      setSchedulesMap(prev => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[tableId]]
      }))
    }, [setSchedulesMap, tableId]);

    const removeTable = useCallback(() => {
      setSchedulesMap(prev => {
        const copy = { ...prev };
        delete copy[tableId];
        return copy;
      })
    }, [setSchedulesMap, tableId]);

    return (
      <Stack key={tableId} width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={onOpenSearch}>시간표 추가</Button>
            <Button colorScheme="green" mx="1px" onClick={duplicateTable}>복제</Button>
            <Button colorScheme="green" isDisabled={disabledRemoveButton}
                    onClick={removeTable}>삭제</Button>
          </ButtonGroup>
        </Flex>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          onScheduleTimeClick={onScheduleTimeClick}
          onDeleteButtonClick={onDeleteButtonClick}
        />
      </Stack>
    );
  }, (a, b) => a.tableId === b.tableId && a.schedules === b.schedules && a.index === b.index);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableEntries.map(([tableId, schedules], index) => (
          <TableCard key={tableId} tableId={tableId} schedules={schedules} index={index} />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
}

export default React.memo(ScheduleTables);
