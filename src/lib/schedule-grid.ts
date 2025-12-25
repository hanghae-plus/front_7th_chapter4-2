import { CellSize, DAY_LABELS, GRID_BORDER_WIDTH, GRID_HEADER_HEIGHT, SCHEDULE_COLORS, TIME_COLUMN_WIDTH } from "@/constants";
import { Schedule } from "@/types";

/**
 * 스케줄 아이템의 그리드 위치 계산
 */
export function calculateSchedulePosition(day: string, range: number[]) {
  const dayIndex = DAY_LABELS.indexOf(day as typeof DAY_LABELS[number]);
  const topIndex = range[0] - 1;
  const size = range.length;

  return {
    left: TIME_COLUMN_WIDTH + (CellSize.WIDTH * dayIndex) + GRID_BORDER_WIDTH,
    top: GRID_HEADER_HEIGHT + (topIndex * CellSize.HEIGHT) + GRID_BORDER_WIDTH,
    width: CellSize.WIDTH - GRID_BORDER_WIDTH,
    height: CellSize.HEIGHT * size - GRID_BORDER_WIDTH,
  };
}

/**
 * 스케줄 목록에서 강의별 색상 맵 생성
 */
export function createColorMap(schedules: Schedule[]): Record<string, string> {
  const lectureIds = [...new Set(schedules.map(({ lecture }) => lecture.id))];
  return Object.fromEntries(
    lectureIds.map((id, index) => [id, SCHEDULE_COLORS[index % SCHEDULE_COLORS.length]])
  );
}
