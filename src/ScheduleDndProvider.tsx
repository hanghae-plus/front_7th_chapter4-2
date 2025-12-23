import {
  DndContext,
  Modifier,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { PropsWithChildren } from "react";
import { CellSize, DAY_LABELS } from "./constants.ts";
import { useScheduleContext } from "./ScheduleContext.tsx";

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

interface ScheduleDndProviderProps extends PropsWithChildren {
  tableId: string;
}

/**
 * 각 시간표별로 독립적인 DnD Context를 제공하는 Provider
 * 한 테이블에서 드래그할 때 다른 테이블은 리렌더링되지 않도록 최적화
 */
export default function ScheduleDndProvider({
  children,
  tableId,
}: ScheduleDndProviderProps) {
  const { getSchedules, setSchedules } = useScheduleContext();
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleDragEnd = (event: any) => {
    const { active, delta } = event;
    const { x, y } = delta;
    // tableId는 props로 받으므로 active.id에서 파싱할 필요 없음
    const index = Number(String(active.id).split(":")[1]);
    const currentSchedules = getSchedules(tableId);
    const schedule = currentSchedules[index];
    const nowDayIndex = DAY_LABELS.indexOf(
      schedule.day as (typeof DAY_LABELS)[number]
    );
    const moveDayIndex = Math.floor(x / 80);
    const moveTimeIndex = Math.floor(y / 30);

    // 해당 시간표만 독립적으로 업데이트
    // 다른 시간표는 전혀 영향을 받지 않음
    const newSchedules = currentSchedules.map((targetSchedule, targetIndex) => {
      if (targetIndex !== index) {
        // 변경되지 않은 스케줄은 기존 참조 유지
        return targetSchedule;
      }
      // 변경된 스케줄만 새 객체로 생성
      return {
        ...targetSchedule,
        day: DAY_LABELS[nowDayIndex + moveDayIndex],
        range: targetSchedule.range.map((time) => time + moveTimeIndex),
      };
    });

    // 해당 시간표만 업데이트 (다른 시간표는 전혀 영향 없음)
    setSchedules(tableId, newSchedules);
  };

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
