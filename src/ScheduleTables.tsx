import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext, useSchedule, useScheduleIds } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useState } from "react";

// 개별 시간표 래퍼 컴포넌트
interface ScheduleTableWrapperProps {
  tableId: string;
  index: number;
  disabledRemoveButton: boolean;
  onOpenSearch: (tableId: string) => void;
  onDuplicate: (tableId: string) => void;
  onRemove: (tableId: string) => void;
}

const ScheduleTableWrapper = memo(({
  tableId,
  index,
  disabledRemoveButton,
  onOpenSearch,
  onDuplicate,
  onRemove,
}: ScheduleTableWrapperProps) => {
  const { schedules, updateSchedules } = useSchedule(tableId);

  const handleScheduleTimeClick = useCallback((_timeInfo: { day: string; time: number }) => {
    onOpenSearch(tableId);
  }, [tableId, onOpenSearch]);

  const handleDeleteButtonClick = useCallback(({ day, time }: { day: string; time: number }) => {
    updateSchedules(prev => prev.filter(schedule => schedule.day !== day || !schedule.range.includes(time)));
  }, [updateSchedules]);

  return (
    <Stack width="600px">
      <Flex justifyContent="space-between" alignItems="center">
        <Heading as="h3" fontSize="lg">시간표 {index + 1}</Heading>
        <ButtonGroup size="sm" isAttached>
          <Button colorScheme="green" onClick={() => onOpenSearch(tableId)}>시간표 추가</Button>
          <Button colorScheme="green" mx="1px" onClick={() => onDuplicate(tableId)}>복제</Button>
          <Button colorScheme="green" isDisabled={disabledRemoveButton}
                  onClick={() => onRemove(tableId)}>삭제</Button>
        </ButtonGroup>
      </Flex>
      <ScheduleTable
        schedules={schedules}
        tableId={tableId}
        onScheduleTimeClick={handleScheduleTimeClick}
        onDeleteButtonClick={handleDeleteButtonClick}
      />
    </Stack>
  );
});

export const ScheduleTables = () => {
  const { setSchedulesMap } = useScheduleContext();
  const scheduleIds = useScheduleIds();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = scheduleIds.length === 1;

  const handleOpenSearch = useCallback((tableId: string) => {
    setSearchInfo({ tableId });
  }, []);

  const handleDuplicate = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }));
  }, [setSchedulesMap]);

  const handleRemove = useCallback((targetId: string) => {
    setSchedulesMap(prev => {
      const { [targetId]: _, ...rest } = prev;
      return rest;
    });
  }, [setSchedulesMap]);

  const handleCloseSearch = useCallback(() => {
    setSearchInfo(null);
  }, []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {scheduleIds.map((tableId, index) => (
          <ScheduleTableWrapper
            key={tableId}
            tableId={tableId}
            index={index}
            disabledRemoveButton={disabledRemoveButton}
            onOpenSearch={handleOpenSearch}
            onDuplicate={handleDuplicate}
            onRemove={handleRemove}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={handleCloseSearch}/>
    </>
  );
}
