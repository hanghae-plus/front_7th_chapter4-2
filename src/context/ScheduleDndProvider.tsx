import {
  DndContext,
  DragEndEvent,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { PropsWithChildren, memo } from 'react';
import { CellSize, DAY_LABELS } from '../constants';
import { useScheduleActions } from './useSchedule';
import useAutoCallback from '../hooks/useAutoCallback';

function createSnapModifier(): Modifier {
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
}

const modifiers = [createSnapModifier()];

interface ScheduleDndProviderProps {
  tableId: string;
}

export const ScheduleDndProvider = memo(
  ({ children, tableId }: PropsWithChildren<ScheduleDndProviderProps>) => {
    const { setSchedulesMap } = useScheduleActions();

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
      })
    );

    const handleDragEnd = useAutoCallback((event: DragEndEvent) => {
      const { active, delta } = event;
      const { x, y } = delta;
      const [eventTableId, indexStr] = String(active.id).split(':');

      // 다른 테이블의 이벤트는 무시
      if (eventTableId !== tableId) return;

      const targetIndex = Number(indexStr);
      const moveDayIndex = Math.floor(x / CellSize.WIDTH);
      const moveTimeIndex = Math.floor(y / CellSize.HEIGHT);

      // 이동이 없으면 스킵
      if (moveDayIndex === 0 && moveTimeIndex === 0) return;

      setSchedulesMap((prev) => {
        const targetSchedules = prev[tableId];
        if (!targetSchedules) return prev;

        const schedule = targetSchedules[targetIndex];
        if (!schedule) return prev;

        const nowDayIndex = DAY_LABELS.indexOf(
          schedule.day as (typeof DAY_LABELS)[number]
        );
        const newDay = DAY_LABELS[nowDayIndex + moveDayIndex];
        const newRange = schedule.range.map((time) => time + moveTimeIndex);

        return {
          ...prev,
          [tableId]: targetSchedules.map((s, i) =>
            i !== targetIndex ? s : { ...s, day: newDay, range: newRange }
          ),
        };
      });
    });

    return (
      <DndContext
        sensors={sensors}
        modifiers={modifiers}
        onDragEnd={handleDragEnd}
      >
        {children}
      </DndContext>
    );
  }
);
