import { Modifier } from "@dnd-kit/core";
import { CellSize, DAY_LABELS } from "../constants.ts";
import { Schedule } from "../types.ts";

/**
 * 드래그 중 스냅 모디파이어를 생성합니다.
 */
export function createSnapModifier(): Modifier {
  return ({ transform, containerNodeRect, draggingNodeRect }) => {
    const containerTop = containerNodeRect?.top ?? 0;
    const containerLeft = containerNodeRect?.left ?? 0;
    const containerBottom = containerNodeRect?.bottom ?? 0;
    const containerRight = containerNodeRect?.right ?? 0;

    const { top = 0, left = 0, bottom = 0, right = 0 } =
      draggingNodeRect ?? {};

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

interface DragEndEvent {
  active: { id: string };
  delta: { x: number; y: number };
}

/**
 * 드래그 종료 시 스케줄을 업데이트하는 비즈니스 로직
 */
export const updateScheduleOnDragEnd = (
  event: DragEndEvent,
  currentSchedules: Schedule[]
): Schedule[] => {
  const { active, delta } = event;
  const { x, y } = delta;
  const index = Number(String(active.id).split(":")[1]);
  const schedule = currentSchedules[index];
  const nowDayIndex = DAY_LABELS.indexOf(
    schedule.day as (typeof DAY_LABELS)[number]
  );
  const moveDayIndex = Math.floor(x / 80);
  const moveTimeIndex = Math.floor(y / 30);

  // 해당 시간표만 독립적으로 업데이트
  // 다른 시간표는 전혀 영향을 받지 않음
  
  // 변경된 스케줄 계산
  const newDay = DAY_LABELS[nowDayIndex + moveDayIndex];
  const newRange = schedule.range.map((time) => time + moveTimeIndex);
  
  // 실제로 변경이 있는지 확인
  const hasChanged = 
    schedule.day !== newDay ||
    schedule.range.length !== newRange.length ||
    schedule.range.some((time, i) => time !== newRange[i]);
  
  // 변경이 없으면 기존 배열 참조 유지
  if (!hasChanged) {
    return currentSchedules;
  }
  
  // 변경이 있으면 새 배열 생성 (변경되지 않은 스케줄은 기존 참조 유지)
  return currentSchedules.map((targetSchedule, targetIndex) => {
    if (targetIndex !== index) {
      // 변경되지 않은 스케줄은 기존 참조 유지
      return targetSchedule;
    }
    // 변경된 스케줄만 새 객체로 생성
    return {
      ...targetSchedule,
      day: newDay,
      range: newRange,
    };
  });
};

