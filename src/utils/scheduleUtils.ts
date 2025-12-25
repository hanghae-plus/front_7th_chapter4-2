import { Schedule } from "../types.ts";

/**
 * 고유한 강의 ID 목록을 추출합니다.
 */
export const extractUniqueLectureIds = (
  schedules: Schedule[]
): string[] => {
  return [...new Set(schedules.map(({ lecture }) => lecture.id))];
};

/**
 * 강의 ID에 대한 색상 맵을 생성합니다.
 */
export const createColorMap = (lectureIds: string[]): Map<string, string> => {
  const colors = ["#fdd", "#ffd", "#dff", "#ddf", "#fdf", "#dfd"];
  const map = new Map<string, string>();
  lectureIds.forEach((lectureId, index) => {
    map.set(lectureId, colors[index % colors.length]);
  });
  return map;
};

/**
 * 강의 ID에 해당하는 색상을 가져옵니다.
 */
export const getScheduleColor = (
  lectureId: string,
  colorMap: Map<string, string>
): string => {
  return colorMap.get(lectureId) || "#fdd";
};

/**
 * 스케줄에서 특정 시간의 스케줄을 필터링합니다.
 */
export const filterScheduleByTime = (
  schedules: Schedule[],
  day: string,
  time: number
): Schedule[] => {
  return schedules.filter(
    (schedule) => schedule.day !== day || !schedule.range.includes(time)
  );
};

/**
 * 새로운 시간표 ID를 생성합니다.
 */
export const generateTableId = (): string => {
  return `schedule-${Date.now()}`;
};

