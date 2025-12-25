import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { memo, useCallback, useMemo, useState } from "react";
import ScheduleDndProvider, { useActiveTableId } from "./ScheduleDndProvider.tsx";
import { Schedule } from "./types.ts";

export const ScheduleTables = () => (
  <ScheduleDndProvider>
    <ScheduleTablesContent />
  </ScheduleDndProvider>
);

const ScheduleTablesContent = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);
  const activeTableId = useActiveTableId();

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const tableEntries = useMemo(
    () => Object.entries(schedulesMap),
    [schedulesMap]
  );

  const duplicate = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap]
  );

  const remove = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => {
        delete prev[targetId];
        return { ...prev };
      });
    },
    [setSchedulesMap]
  );

  const closeSearchDialog = useCallback(() => {
    setSearchInfo(null);
  }, []);

  const handleScheduleTimeClick = useCallback(
    ({
      tableId,
      day,
      time,
    }: {
      tableId: string;
      day: string;
      time: number;
    }) => {
      setSearchInfo({ tableId, day, time });
    },
    []
  );

  const handleDeleteSchedule = useCallback(
    (tableId: string, scheduleIndex: number) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter((_, idx) => idx !== scheduleIndex),
      }));
    },
    [setSchedulesMap]
  );

  const openSearchDialog = useCallback(
    (tableId: string) => {
      setSearchInfo({ tableId });
    },
    [setSearchInfo]
  );

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {tableEntries.map(([tableId, schedules], index) => (
          <ScheduleTableSection
            key={tableId}
            tableId={tableId}
            index={index}
            schedules={schedules}
            isActive={activeTableId === tableId}
            disabledRemoveButton={disabledRemoveButton}
            onOpenSearchDialog={openSearchDialog}
            onDuplicate={duplicate}
            onRemove={remove}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteSchedule={handleDeleteSchedule}
          />
        ))}
      </Flex>
      {searchInfo && (
        <SearchDialog searchInfo={searchInfo} onClose={closeSearchDialog} />
      )}
    </>
  );
};

interface ScheduleTableSectionProps {
  tableId: string;
  index: number;
  schedules: Schedule[];
  isActive: boolean;
  disabledRemoveButton: boolean;
  onOpenSearchDialog: (tableId: string) => void;
  onDuplicate: (targetId: string) => void;
  onRemove: (targetId: string) => void;
  onScheduleTimeClick: (timeInfo: {
    tableId: string;
    day: string;
    time: number;
  }) => void;
  onDeleteSchedule: (tableId: string, scheduleIndex: number) => void;
}

const ScheduleTableSection = memo(
  ({
    tableId,
    index,
    schedules,
    isActive,
    disabledRemoveButton,
    onOpenSearchDialog,
    onDuplicate,
    onRemove,
    onScheduleTimeClick,
    onDeleteSchedule,
  }: ScheduleTableSectionProps) => {
    const handleOpenSearchDialog = useCallback(() => {
      onOpenSearchDialog(tableId);
    }, [onOpenSearchDialog, tableId]);

    const handleDuplicate = useCallback(() => {
      onDuplicate(tableId);
    }, [onDuplicate, tableId]);

    const handleRemove = useCallback(() => {
      onRemove(tableId);
    }, [onRemove, tableId]);

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={handleOpenSearchDialog}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={handleDuplicate}>
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={handleRemove}>
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleTable
          schedules={schedules}
          tableId={tableId}
          isActive={isActive}
          onScheduleTimeClick={onScheduleTimeClick}
          onDeleteSchedule={onDeleteSchedule}
        />
      </Stack>
    );
  }
);
