import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useState, useCallback } from "react";

export const ScheduleTables = () => {
  const { schedulesMap, duplicateTable, removeTable, deleteSchedule } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const onScheduleTimeClick = useCallback((tableId: string, timeInfo: { day: string, time: number }) => {
    setSearchInfo({ tableId, ...timeInfo });
  }, []);

  const onDeleteButtonClick = useCallback((tableId: string, { day, time }: { day: string, time: number }) => {
    deleteSchedule(tableId, day, time);
  }, [deleteSchedule]);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <Stack key={tableId} width="600px">
            <Flex justifyContent="space-between" alignItems="center">
              <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
              <ButtonGroup size="sm" isAttached>
                <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>시간표 추가</Button>
                <Button colorScheme="green" mx="1px" onClick={() => duplicateTable(tableId)}>복제</Button>
                <Button colorScheme="green" isDisabled={disabledRemoveButton}
                        onClick={() => removeTable(tableId)}>삭제</Button>
              </ButtonGroup>
            </Flex>
            <ScheduleTable
              key={`schedule-table-${index}`}
              schedules={schedules}
              tableId={tableId}
              onScheduleTimeClick={onScheduleTimeClick}
              onDeleteButtonClick={onDeleteButtonClick}
            />
          </Stack>
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)}/>
    </>
  );
}
