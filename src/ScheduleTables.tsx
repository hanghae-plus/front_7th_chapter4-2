import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext, useSetScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./SearchDialog.tsx";
import { useCallback, useState } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";
import { Schedule } from "./types.ts";
import { memo } from "react";

const ScheduleTableBox = memo(
  ({
    tableId,
    schedules,
    index,
    setSearchInfo,
    disabledRemoveButton,
  }: {
    tableId: string;
    schedules: Schedule[];
    index: number;
    setSearchInfo: (info: { tableId: string }) => void;
    disabledRemoveButton: boolean;
  }) => {
    const { setSchedulesMap } = useSetScheduleContext();

    const duplicate = (targetId: string) => {
      setSchedulesMap((prev: Record<string, Schedule[]>) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    };

    const remove = (targetId: string) => {
      setSchedulesMap(prev => {
        delete prev[targetId];
        return { ...prev };
      });
    };

    const scheduleTimeClick = useCallback(
      (timeInfo: { day: string; time: number }) => setSearchInfo({ tableId, ...timeInfo }),
      [tableId],
    );

    const scheduleDeleteButtonClick = useCallback(
      ({ day, time }: { day: string; time: number }) =>
        setSchedulesMap((prev: any) => ({
          ...prev,
          [tableId]: prev[tableId].filter(
            (schedule: Schedule) => schedule.day !== day || !schedule.range.includes(time),
          ),
        })),
      [tableId],
    );

    return (
      <Stack key={tableId} width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={() => setSearchInfo({ tableId })}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={() => duplicate(tableId)}>
              복제
            </Button>
            <Button colorScheme="green" isDisabled={disabledRemoveButton} onClick={() => remove(tableId)}>
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleDndProvider>
          <ScheduleTable
            key={`schedule-table-${index}`}
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={scheduleTimeClick}
            onDeleteButtonClick={scheduleDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  },
);

export const ScheduleTables = () => {
  const { schedulesMap } = useScheduleContext();

  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => {
          return (
            <ScheduleTableBox
              key={`schedule-table-${index}`}
              tableId={tableId}
              schedules={schedules}
              index={index}
              setSearchInfo={setSearchInfo}
              disabledRemoveButton={disabledRemoveButton}
            />
          );
        })}
      </Flex>
      {searchInfo && <SearchDialog searchInfo={searchInfo} onClose={() => setSearchInfo(null)} />}
    </>
  );
};
