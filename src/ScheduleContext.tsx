import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useState } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

// 특정 tableId의 schedules만 가져오는 최적화된 훅
export const useSchedules = (tableId: string) => {
  const { schedulesMap } = useScheduleContext();

  // tableId에 해당하는 schedules만 메모이제이션
  // 다른 table의 schedules가 변경되어도 리렌더링 방지
  return useMemo(() => {
    return schedulesMap[tableId] || [];
  }, [schedulesMap, tableId]);
};

// schedules 업데이트 함수를 제공하는 훅
export const useSchedulesActions = () => {
  const { setSchedulesMap } = useScheduleContext();

  // 특정 tableId의 schedules만 업데이트하는 함수
  const updateSchedules = useCallback((tableId: string, updater: (prev: Schedule[]) => Schedule[]) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: updater(prev[tableId] || [])
    }));
  }, [setSchedulesMap]);

  // schedules 추가 함수
  const addSchedules = useCallback((tableId: string, newSchedules: Schedule[]) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...(prev[tableId] || []), ...newSchedules]
    }));
  }, [setSchedulesMap]);

  // schedule 삭제 함수
  const deleteSchedule = useCallback((tableId: string, day: string, time: number) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: prev[tableId].filter(schedule =>
        !(schedule.day === day && schedule.range.includes(time))
      )
    }));
  }, [setSchedulesMap]);

  return { updateSchedules, addSchedules, deleteSchedule, setSchedulesMap };
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // Context value를 useMemo로 메모이제이션
  const value = useMemo(() => ({
    schedulesMap,
    setSchedulesMap
  }), [schedulesMap]);

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
