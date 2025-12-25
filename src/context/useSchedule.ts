import { useMemo, useCallback, useContext } from 'react';
import {
  ScheduleStateContext,
  ScheduleDispatchContext,
  SchedulesMap,
  ScheduleDispatch,
} from './ScheduleContext';
import { Schedule } from '../types';

// State Context hook - schedulesMap 변경 시 리렌더링됨
export const useSchedulesMap = (): SchedulesMap => {
  const context = useContext(ScheduleStateContext);
  if (context === undefined) {
    throw new Error('useSchedulesMap must be used within a ScheduleProvider');
  }
  return context;
};

// Dispatch Context hook - 안정적, 리렌더링 유발하지 않음
export const useScheduleDispatch = (): ScheduleDispatch => {
  const context = useContext(ScheduleDispatchContext);
  if (context === undefined) {
    throw new Error(
      'useScheduleDispatch must be used within a ScheduleProvider',
    );
  }
  return context;
};

// 기존 호환성을 위한 hook (State + Dispatch 둘 다 구독)
export const useScheduleContext = () => {
  const schedulesMap = useSchedulesMap();
  const setSchedulesMap = useScheduleDispatch();
  return { schedulesMap, setSchedulesMap };
};

// tableId 배열만 구독 (테이블 추가/삭제 시에만 변경)
export const useTableIds = (): string[] => {
  const schedulesMap = useSchedulesMap();
  return useMemo(() => Object.keys(schedulesMap), [schedulesMap]);
};

// 테이블 개수만 구독 (disabledRemove 계산용)
export const useTableCount = (): number => {
  const schedulesMap = useSchedulesMap();
  return Object.keys(schedulesMap).length;
};

// 특정 테이블의 schedules만 구독
export const useSchedulesByTableId = (tableId: string): Schedule[] => {
  const schedulesMap = useSchedulesMap();
  return schedulesMap[tableId] ?? [];
};

// 액션만 구독 - Dispatch Context만 사용하므로 State 변경에 리렌더링 없음!
export const useScheduleActions = () => {
  const setSchedulesMap = useScheduleDispatch();

  const addTable = useCallback(() => {
    setSchedulesMap((prev) => ({
      ...prev,
      [`schedule-${Date.now()}`]: [],
    }));
  }, [setSchedulesMap]);

  const duplicateTable = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [`schedule-${Date.now()}`]: [...prev[targetId]],
      }));
    },
    [setSchedulesMap],
  );

  const removeTable = useCallback(
    (targetId: string) => {
      setSchedulesMap((prev) => {
        const newMap = { ...prev };
        delete newMap[targetId];
        return newMap;
      });
    },
    [setSchedulesMap],
  );

  const addSchedule = useCallback(
    (tableId: string, schedule: Schedule) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: [...prev[tableId], schedule],
      }));
    },
    [setSchedulesMap],
  );

  const deleteSchedule = useCallback(
    (tableId: string, day: string, time: number) => {
      setSchedulesMap((prev) => ({
        ...prev,
        [tableId]: prev[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time),
        ),
      }));
    },
    [setSchedulesMap],
  );

  return useMemo(
    () => ({
      setSchedulesMap,
      addTable,
      duplicateTable,
      removeTable,
      addSchedule,
      deleteSchedule,
    }),
    [
      setSchedulesMap,
      addTable,
      duplicateTable,
      removeTable,
      addSchedule,
      deleteSchedule,
    ],
  );
};

