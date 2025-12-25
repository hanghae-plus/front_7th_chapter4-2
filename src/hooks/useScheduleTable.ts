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
  // 이전 handlers를 저장하여 schedule 객체 참조가 같으면 기존 handler 참조 유지
  const prevHandlersRef = useRef<Array<() => void>>([]);
  const prevSchedulesRef = useRef<Schedule[]>([]);
  
  const deleteHandlers = useMemo(() => {
    // schedules 배열의 참조가 같으면 이전 handlers 반환
    if (schedules === prevSchedulesRef.current) {
      return prevHandlersRef.current;
    }
    
    // 각 schedule 객체의 참조를 비교하여 변경되지 않은 것은 기존 handler 참조 유지
    const newHandlers = schedules.map((schedule, index) => {
      const prevSchedule = prevSchedulesRef.current[index];
      const prevHandler = prevHandlersRef.current[index];
      
      // schedule 객체 참조가 같으면 기존 handler 참조 유지
      if (prevSchedule === schedule && prevHandler) {
        return prevHandler;
      }
      
      // 변경된 schedule에 대해서만 새 handler 생성
      return () =>
        onDeleteButtonClickRef.current?.({
          day: schedule.day,
          time: schedule.range[0],
        });
    });
    
    // 다음 비교를 위해 저장
    prevHandlersRef.current = newHandlers;
    prevSchedulesRef.current = schedules;
    
    return newHandlers;
  }, [schedules]);

  // 각 스케줄별 bg 값을 메모이제이션하여 안정화
  // 이전 bg 배열을 저장하여 schedule 객체 참조가 같으면 기존 값 유지
  const prevBgsRef = useRef<string[]>([]);
  const prevSchedulesForBgsRef = useRef<Schedule[]>([]);
  
  const scheduleBgs = useMemo(() => {
    // schedules 배열의 참조가 같으면 이전 bgs 반환
    if (schedules === prevSchedulesForBgsRef.current) {
      return prevBgsRef.current;
    }
    
    // 각 schedule 객체의 참조를 비교하여 변경되지 않은 것은 기존 bg 값 유지
    const newBgs = schedules.map((schedule, index) => {
      const prevSchedule = prevSchedulesForBgsRef.current[index];
      const prevBg = prevBgsRef.current[index];
      
      // schedule 객체 참조가 같고 lecture.id도 같으면 기존 bg 값 유지
      if (prevSchedule === schedule && prevBg) {
        return prevBg;
      }
      
      // 변경된 schedule에 대해서만 새 bg 값 계산
      return getScheduleColor(schedule.lecture.id, colorMap);
    });
    
    // 다음 비교를 위해 저장
    prevBgsRef.current = newBgs;
    prevSchedulesForBgsRef.current = schedules;
    
    return newBgs;
  }, [schedules, colorMap]);

  return {
    scheduleBgs,
    deleteHandlers,
    handleCellClick,
  };
};

