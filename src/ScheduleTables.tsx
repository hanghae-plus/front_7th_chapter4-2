import { Button, ButtonGroup, Flex, Heading, Stack } from "@chakra-ui/react";
import ScheduleTable from "./ScheduleTable.tsx";
import { useScheduleContext } from "./ScheduleContext.tsx";
import SearchDialog from "./components/SearchDialog/index.tsx";
import { memo, useCallback, useState } from "react";
import type { ComponentProps } from "react";
import ScheduleDndProvider from "./ScheduleDndProvider.tsx";

type SearchInfo = {
  tableId: string;
  day?: string;
  time?: number;
};

type ScheduleTableProps = ComponentProps<typeof ScheduleTable>;

type ScheduleTableBlockProps = {
  index: number;
  tableId: string;
  schedules: ScheduleTableProps["schedules"];
  disabledRemoveButton: boolean;
  onAdd: (tableId: string) => void;
  onDuplicate: (tableId: string) => void;
  onRemove: (tableId: string) => void;
  onScheduleTimeClick: (info: SearchInfo) => void;
  onDeleteButtonClick: (info: Required<SearchInfo>) => void;
};

const ScheduleTableBlock = memo(
  ({
    index,
    tableId,
    schedules,
    disabledRemoveButton,
    onAdd,
    onDuplicate,
    onRemove,
    onScheduleTimeClick,
    onDeleteButtonClick,
  }: ScheduleTableBlockProps) => {
    const handleAdd = useCallback(() => onAdd(tableId), [onAdd, tableId]);
    const handleDuplicate = useCallback(() => onDuplicate(tableId), [onDuplicate, tableId]);
    const handleRemove = useCallback(() => onRemove(tableId), [onRemove, tableId]);
    const handleScheduleTimeClick = useCallback(
      (timeInfo: Omit<SearchInfo, "tableId">) => onScheduleTimeClick({ tableId, ...timeInfo }),
      [onScheduleTimeClick, tableId],
    );
    const handleDeleteButtonClick = useCallback(
      ({ day, time }: Omit<Required<SearchInfo>, "tableId">) => onDeleteButtonClick({ tableId, day, time }),
      [onDeleteButtonClick, tableId],
    );

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표{index + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={handleAdd}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={handleDuplicate}>
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={disabledRemoveButton}
              onClick={handleRemove}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <ScheduleDndProvider>
          <ScheduleTable
            key={`schedule-table-${index}`}
            schedules={schedules}
            tableId={tableId}
            onScheduleTimeClick={handleScheduleTimeClick}
            onDeleteButtonClick={handleDeleteButtonClick}
          />
        </ScheduleDndProvider>
      </Stack>
    );
  },
);

ScheduleTableBlock.displayName = "ScheduleTableBlock";

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<SearchInfo | null>(null);

  const disabledRemoveButton = Object.keys(schedulesMap).length === 1;

  const add = useCallback((tableId: string) => setSearchInfo({ tableId }), []);

  const duplicate = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap],
  );

  const remove = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => {
        delete prev[targetId];
        return { ...prev };
      });
    },
    [setSchedulesMap],
  );

  const deleteSchedule = useCallback(
    ({ tableId, day, time }: Required<SearchInfo>) =>
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter((schedule) => schedule.day !== day || !schedule.range.includes(time)),
      })),
    [setSchedulesMap],
  );

  const closeSearchDialog = useCallback(() => setSearchInfo(null), []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], index) => (
          <ScheduleTableBlock
            key={tableId}
            index={index}
            tableId={tableId}
            schedules={schedules}
            disabledRemoveButton={disabledRemoveButton}
            onAdd={add}
            onDuplicate={duplicate}
            onRemove={remove}
            onScheduleTimeClick={setSearchInfo}
            onDeleteButtonClick={deleteSchedule}
          />
        ))}
      </Flex>
      {searchInfo && <SearchDialog searchInfo={searchInfo} onClose={closeSearchDialog} />}
    </>
  );
};


