import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useCallback, useMemo, useState } from "react";
import { Schedule } from "./types.ts";

export const ScheduleTables = () => {
  const { tableIds, schedulesMap, setSchedulesMap, updateTableSchedules, getSchedulesMapSize } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const schedulesMapSize = getSchedulesMapSize();
  const disabledRemoveButton = useMemo(() => schedulesMapSize === 1, [schedulesMapSize]);

  const duplicate = useCallback((targetId: string) => {
    const schedules = schedulesMap[targetId] || [];
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...schedules]
    }));
  }, [setSchedulesMap, schedulesMap]);

  const remove = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      const newMap = { ...prev };
      delete newMap[targetId];
      return newMap;
    });
  }, [setSchedulesMap]);

  // 각 테이블의 schedules를 가져오는 메모이제이션된 entries
  // updateTableSchedules가 특정 테이블만 업데이트하므로, 변경되지 않은 테이블의 schedules 배열 참조는 유지됨
  const scheduleEntries = useMemo(() => {
    return tableIds.map(tableId => [tableId, schedulesMap[tableId] || []] as [string, Schedule[]]);
  }, [tableIds, schedulesMap]);

  const handleCloseSearchDialog = useCallback(() => {
    setSearchInfo(null);
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {scheduleEntries.map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
              <ButtonGroup size="sm" isAttached>
                <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>시간표 추가</Button>
                <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>복제</Button>
                <Button colorScheme="green" isDisabled={disabledRemoveButton}
                        onClick={() => remove(tableId)}>삭제</Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={(timeInfo) => setSearchInfo({ tableId, ...timeInfo })}
              onDeleteButtonClick={({ day, time }) => updateTableSchedules(tableId, (currentSchedules) =>
                currentSchedules.filter(schedule => schedule.day !== day || !schedule.range.includes(time))
              )}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleCloseSearchDialog}/>
    </>
  );
}
