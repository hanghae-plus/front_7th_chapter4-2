import { Button, ButtonGroup, Flex, Heading, Stack } from '@chakra-ui/react';
import ScheduleTable from './ScheduleTable.tsx';
import { useScheduleContext } from './ScheduleContext.tsx';
import SearchDialog from './SearchDialog.tsx';
import { memo, useCallback, useMemo, useState } from 'react';
import { Schedule } from './types.ts';
import {
  DndContext,
  DragEndEvent,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { CellSize, DAY_LABELS } from './constants.ts';

// 그리드 스냅 modifier 생성 함수
const createGridSnapModifier = (): Modifier => {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } = draggingNodeRect ?? {};

    const minX = containerLeft - left + 120 + 1;
    const minY = containerTop - top + 40 + 1;
    const maxX = containerRight - right;
    const maxY = containerBottom - bottom;

    return {
      ...transform,
      x: Math.min(
        Math.max(
          Math.round(transform.x / CellSize.WIDTH) * CellSize.WIDTH,
          minX
        ),
        maxX
      ),
      y: Math.min(
        Math.max(
          Math.round(transform.y / CellSize.HEIGHT) * CellSize.HEIGHT,
          minY
        ),
        maxY
      ),
    };
  };
};

const gridSnapModifiers = [createGridSnapModifier()];

// 개별 시간표 아이템 - 각자 독립적인 DndContext를 가짐
interface ScheduleItemProps {
  tableId: string;
  schedules: Schedule[];
  displayIndex: number;
  canDelete: boolean;
  onSearchOpen: (tableId: string) => void;
  onDuplicateTable: (tableId: string) => void;
  onDeleteTable: (tableId: string) => void;
  onCellSelect: (tableId: string, info: { day: string; time: number }) => void;
  onScheduleRemove: (tableId: string, day: string, time: number) => void;
  onDragComplete: (tableId: string, event: DragEndEvent) => void;
}

const ScheduleItem = memo(
  ({
    tableId,
    schedules,
    displayIndex,
    canDelete,
    onSearchOpen,
    onDuplicateTable,
    onDeleteTable,
    onCellSelect,
    onScheduleRemove,
    onDragComplete,
  }: ScheduleItemProps) => {
    const pointerSensor = useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    });
    const sensors = useSensors(pointerSensor);

    // 각 핸들러를 useCallback으로 안정화
    const onDragEnd = useCallback(
      (event: DragEndEvent) => onDragComplete(tableId, event),
      [tableId, onDragComplete]
    );

    const openSearch = useCallback(
      () => onSearchOpen(tableId),
      [tableId, onSearchOpen]
    );

    const duplicateThis = useCallback(
      () => onDuplicateTable(tableId),
      [tableId, onDuplicateTable]
    );

    const deleteThis = useCallback(
      () => onDeleteTable(tableId),
      [tableId, onDeleteTable]
    );

    const selectCell = useCallback(
      (info: { day: string; time: number }) => onCellSelect(tableId, info),
      [tableId, onCellSelect]
    );

    const removeSchedule = useCallback(
      ({ day, time }: { day: string; time: number }) =>
        onScheduleRemove(tableId, day, time),
      [tableId, onScheduleRemove]
    );

    return (
      <Stack width="600px">
        <Flex justifyContent="space-between" alignItems="center">
          <Heading as="h3" fontSize="lg">
            시간표 {displayIndex + 1}
          </Heading>
          <ButtonGroup size="sm" isAttached>
            <Button colorScheme="green" onClick={openSearch}>
              시간표 추가
            </Button>
            <Button colorScheme="green" mx="1px" onClick={duplicateThis}>
              복제
            </Button>
            <Button
              colorScheme="green"
              isDisabled={!canDelete}
              onClick={deleteThis}
            >
              삭제
            </Button>
          </ButtonGroup>
        </Flex>
        <DndContext
          sensors={sensors}
          modifiers={gridSnapModifiers}
          onDragEnd={onDragEnd}
        >
          <ScheduleTable
            tableId={tableId}
            schedules={schedules}
            onScheduleTimeClick={selectCell}
            onDeleteButtonClick={removeSchedule}
          />
        </DndContext>
      </Stack>
    );
  }
);

export const ScheduleTables = () => {
  const { schedulesMap, setSchedulesMap } = useScheduleContext();
  const [searchInfo, setSearchInfo] = useState<{
    tableId: string;
    day?: string;
    time?: number;
  } | null>(null);

  const canDeleteTable = useMemo(
    () => Object.keys(schedulesMap).length > 1,
    [schedulesMap]
  );

  const duplicateTable = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap]
  );

  const deleteTable = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [targetId]: removed, ...rest } = prev;
        return rest;
      });
    },
    [setSchedulesMap]
  );

  const openSearch = useCallback((tableId: string) => {
    setSearchInfo({ tableId });
  }, []);

  const selectCell = useCallback(
    (tableId: string, info: { day: string; time: number }) => {
      setSearchInfo({ tableId, ...info });
    },
    []
  );

  const removeSchedule = useCallback(
    (tableId: string, day: string, time: number) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (s) => s.day !== day || !s.range.includes(time)
        ),
      }));
    },
    [setSchedulesMap]
  );

  const handleDragComplete = useCallback(
    (tableId: string, event: DragEndEvent) => {
      const { active, delta } = event;
      const { x, y } = delta;
      const [, scheduleIdx] = String(active.id).split(':');
      const dayShift = Math.floor(x / CellSize.WIDTH);
      const timeShift = Math.floor(y / CellSize.HEIGHT);

      setSchedulesMap((prev) => {
        const currentSchedule = prev[tableId][Number(scheduleIdx)];
        const currentDayIdx = DAY_LABELS.indexOf(
          currentSchedule.day as (typeof DAY_LABELS)[number]
        );

        return {
          ...prev,
          [tableId]: prev[tableId].map((schedule, idx) => {
            if (idx !== Number(scheduleIdx)) return schedule;
            return {
              ...schedule,
              day: DAY_LABELS[currentDayIdx + dayShift],
              range: schedule.range.map((t) => t + timeShift),
            };
          }),
        };
      });
    },
    [setSchedulesMap]
  );

  const closeSearch = useCallback(() => setSearchInfo(null), []);

  return (
    <>
      <Flex w="full" gap={6} p={6} flexWrap="wrap">
        {Object.entries(schedulesMap).map(([tableId, schedules], idx) => (
          <ScheduleItem
            key={tableId}
            tableId={tableId}
            schedules={schedules}
            displayIndex={idx}
            canDelete={canDeleteTable}
            onSearchOpen={openSearch}
            onDuplicateTable={duplicateTable}
            onDeleteTable={deleteTable}
            onCellSelect={selectCell}
            onScheduleRemove={removeSchedule}
            onDragComplete={handleDragComplete}
          />
        ))}
      </Flex>
      <SearchDialog searchInfo={searchInfo} onClose={closeSearch} />
    </>
  );
};
