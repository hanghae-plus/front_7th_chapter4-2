import { useMemo, useRef, useEffect, useCallback } from "react";
import { Schedule } from "../types.ts";
import {
  extractUniqueLectureIds,
  createColorMap,
  getScheduleColor,
} from "../utils/scheduleUtils.ts";

interface UseScheduleTableProps {
  schedules: Schedule[];
  onScheduleTimeClick?: (timeInfo: { day: string; time: number }) => void;
  onDeleteButtonClick?: (timeInfo: { day: string; time: number }) => void;
}

interface UseScheduleTableResult {
  scheduleBgs: string[];
  deleteHandlers: Array<() => void>;
  handleCellClick: (day: string, time: number) => void;
}

/**
 * 시간표 관련 비즈니스 로직을 관리하는 훅
 */
export const useScheduleTable = ({
  schedules,
  onScheduleTimeClick,
  onDeleteButtonClick,
}: UseScheduleTableProps): UseScheduleTableResult => {
  // onScheduleTimeClick을 useRef로 저장하여 항상 같은 참조를 유지
  const onScheduleTimeClickRef = useRef(onScheduleTimeClick);
  useEffect(() => {
    onScheduleTimeClickRef.current = onScheduleTimeClick;
  }, [onScheduleTimeClick]);

  // onDeleteButtonClick을 useRef로 저장하여 항상 같은 참조를 유지
  const onDeleteButtonClickRef = useRef(onDeleteButtonClick);
  useEffect(() => {
    onDeleteButtonClickRef.current = onDeleteButtonClick;
  }, [onDeleteButtonClick]);

  // 고유한 강의 ID 목록을 useMemo로 메모이제이션
  const uniqueLectureIds = useMemo(
    () => extractUniqueLectureIds(schedules),
    [schedules]
  );

  // 색상 맵을 useMemo로 메모이제이션
  const colorMap = useMemo(() => createColorMap(uniqueLectureIds), [
    uniqueLectureIds,
  ]);

  // 셀 클릭 핸들러를 useCallback으로 메모이제이션
  const handleCellClick = useCallback(
    (day: string, time: number) => {
      onScheduleTimeClickRef.current?.({ day, time });
    },
    []
  );

  // 각 스케줄별 삭제 핸들러를 메모이제이션하여 안정화
  const deleteHandlers = useMemo(() => {
    return schedules.map((schedule) => {
      return () =>
        onDeleteButtonClickRef.current?.({
          day: schedule.day,
          time: schedule.range[0],
        });
    });
  }, [schedules]);

  // 각 스케줄별 bg 값을 메모이제이션하여 안정화
  const scheduleBgs = useMemo(() => {
    return schedules.map((schedule) =>
      getScheduleColor(schedule.lecture.id, colorMap)
    );
  }, [schedules, colorMap]);

  return {
    scheduleBgs,
    deleteHandlers,
    handleCellClick,
  };
};

