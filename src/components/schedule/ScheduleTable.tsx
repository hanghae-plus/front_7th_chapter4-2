import { memo, useCallback, useMemo, useRef } from "react";
import { Box } from "@chakra-ui/react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import { CellSize, DAY_LABELS } from "@/constants";
import { Schedule } from "@/types";
import { createColorMap } from "@/lib/schedule-grid";
import { snapModifiers } from "@/lib/dnd-modifiers";
import { useDragStyle } from "@/hooks/useDragStyle";

import ScheduleGrid from "./ScheduleGrid";
import DraggableSchedule from "./DraggableSchedule";
import DragOverlayContent from "./DragOverlayContent";

interface Props {
  tableId: string;
  schedules: Schedule[];
  onScheduleTimeClick?: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (tableId: string, timeInfo: { day: string; time: number }) => void;
  onScheduleUpdate?: (tableId: string, index: number, newDay: string, newRange: number[]) => void;
}

// schedules 배열 내용 비교 함수
const areSchedulesEqual = (prev: Schedule[], next: Schedule[]): boolean => {
  if (prev === next) return true;
  if (prev.length !== next.length) return false;

  for (let i = 0; i < prev.length; i++) {
    const p = prev[i];
    const n = next[i];
    if (
      p.day !== n.day ||
      p.range[0] !== n.range[0] ||
      p.range.length !== n.range.length ||
      p.lecture.id !== n.lecture.id
    ) {
      return false;
    }
  }
  return true;
};

const ScheduleTable = memo(
  ({ tableId, schedules, onScheduleTimeClick, onDeleteButtonClick, onScheduleUpdate }: Props) => {
    const activeIdRef = useRef<string | null>(null);
    const { injectDragStyle, removeDragStyle } = useDragStyle();

    // 콜백을 ref로 저장하여 memo 비교에서 제외
    const onScheduleUpdateRef = useRef(onScheduleUpdate);
    onScheduleUpdateRef.current = onScheduleUpdate;

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
      })
    );

    const colorMap = useMemo(() => createColorMap(schedules), [schedules]);

    const handleDragStart = useCallback(
      (event: DragStartEvent) => {
        const id = String(event.active.id);
        activeIdRef.current = id;
        injectDragStyle(id);
      },
      [injectDragStyle]
    );

    const handleDragEnd = useCallback(
      (event: DragEndEvent) => {
        removeDragStyle();
        activeIdRef.current = null;

        const { delta } = event;
        const [, indexStr] = String(event.active.id).split(":");
        const index = Number(indexStr);
        const moveDayIndex = Math.floor(delta.x / CellSize.WIDTH);
        const moveTimeIndex = Math.floor(delta.y / CellSize.HEIGHT);

        if (moveDayIndex === 0 && moveTimeIndex === 0) return;

        const schedule = schedules[index];
        const nowDayIndex = DAY_LABELS.indexOf(schedule.day as (typeof DAY_LABELS)[number]);
        const newDay = DAY_LABELS[nowDayIndex + moveDayIndex];
        const newRange = schedule.range.map((time) => time + moveTimeIndex);

        onScheduleUpdateRef.current?.(tableId, index, newDay, newRange);
      },
      [schedules, tableId, removeDragStyle]
    );

    const handleDragCancel = useCallback(() => {
      removeDragStyle();
      activeIdRef.current = null;
    }, [removeDragStyle]);

    return (
      <DndContext
        sensors={sensors}
        modifiers={snapModifiers}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <Box position="relative">
          <ScheduleGrid tableId={tableId} onScheduleTimeClick={onScheduleTimeClick} />

          {schedules.map((schedule, index) => (
            <DraggableSchedule
              key={`${schedule.lecture.title}-${index}`}
              id={`${tableId}:${index}`}
              data={schedule}
              bg={colorMap[schedule.lecture.id]}
              tableId={tableId}
              onDelete={onDeleteButtonClick}
            />
          ))}
        </Box>

        <DragOverlay modifiers={snapModifiers}>
          <DragOverlayContent />
        </DragOverlay>
      </DndContext>
    );
  },
  (prevProps, nextProps) =>
    prevProps.tableId === nextProps.tableId &&
    areSchedulesEqual(prevProps.schedules, nextProps.schedules)
);

ScheduleTable.displayName = "ScheduleTable";

export default ScheduleTable;
