import {
  DndContext,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PropsWithChildren, useCallback } from "react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { useScheduleActions } from "./ScheduleContext.tsx";

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

export default function ScheduleDndProvider({ children }: PropsWithChildren) {
  const { setSchedulesMap } = useScheduleActions();
  const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8,
        },
      })
  );

  const isValidMove = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (newDayIndex: number, schedule: any, moveTimeIndex: number) => {
        if (newDayIndex < 0 || newDayIndex >= DAY_LABELS.length) return false;

        // 시간 범위가 음수가 되지 않도록 검증
        const newTimeRange = schedule.range.map(
            (time: number) => time + moveTimeIndex
        );
        return newTimeRange.every((time: number) => time > 0);
      },
      []
  );

  const handleDragEnd = useCallback(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (event: any) => {
        const { active, delta } = event;
        const { x, y } = delta;
        const [tableId, index] = active.id.split(":");
        setSchedulesMap((prev) => {
          const schedule = prev[tableId][Number(index)];

          if (!schedule) return prev;

          const nowDayIndex = DAY_LABELS.indexOf(
              schedule.day as (typeof DAY_LABELS)[number]
          );
          const moveDayIndex = Math.floor(x / 80);
          const moveTimeIndex = Math.floor(y / 30);
          const newDayIndex = nowDayIndex + moveDayIndex;
          if (!isValidMove(nowDayIndex + moveDayIndex, schedule, moveTimeIndex))
            return prev;

          return {
            ...prev,
            [tableId]: prev[tableId].map((targetSchedule, targetIndex) =>
                targetIndex === Number(index)
                    ? {
                      ...targetSchedule,
                      day: DAY_LABELS[newDayIndex],
                      range: targetSchedule.range.map(
                          (time) => time + moveTimeIndex
                      ),
                    }
                    : targetSchedule
            ),
          };
        });
      },
      [setSchedulesMap, isValidMove]
  );

  return (
      <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          modifiers={modifiers}
      >
        {children}
      </DndContext>
  );
}