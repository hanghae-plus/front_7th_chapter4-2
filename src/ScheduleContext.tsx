import React, { createContext, PropsWithChildren, useCallback, useContext, useMemo, useRef, useState } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  tableIds: string[];
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
  updateTableSchedules: (tableId: string, updater: (schedules: Schedule[]) => Schedule[]) => void;
  getSchedulesMapSize: () => number;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);
  
  // schedulesMap의 최신 값을 ref로 유지하여 함수 참조를 안정적으로 유지
  const schedulesMapRef = useRef(schedulesMap);
  schedulesMapRef.current = schedulesMap;
  
  // tableIds만 별도 state로 관리하여 변경 감지
  const [tableIds, setTableIds] = useState(() => Object.keys(dummyScheduleMap));

  // 특정 테이블만 업데이트하는 함수 - 메모이제이션으로 불필요한 리렌더링 방지
  const updateTableSchedules = useCallback((tableId: string, updater: (schedules: Schedule[]) => Schedule[]) => {
    setSchedulesMap(prev => {
      const currentSchedules = prev[tableId];
      if (!currentSchedules) return prev;
      
      const newSchedules = updater(currentSchedules);
      
      // 변경사항이 없으면 이전 객체 반환 (리렌더링 방지)
      if (currentSchedules === newSchedules) return prev;
      
      return {
        ...prev,
        [tableId]: newSchedules
      };
    });
  }, []);

  // setSchedulesMap을 래핑하여 tableIds도 업데이트
  const wrappedSetSchedulesMap = useCallback<React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>>((action) => {
    setSchedulesMap(prev => {
      const newMap = typeof action === 'function' ? action(prev) : action;
      setTableIds(Object.keys(newMap));
      return newMap;
    });
  }, []);

  // schedulesMap의 크기를 가져오는 함수 (disabledRemoveButton 등에서 사용)
  const getSchedulesMapSize = useCallback(() => {
    return tableIds.length;
  }, [tableIds]);

  // Context value 메모이제이션
  // schedulesMap을 포함하지만, updateTableSchedules가 특정 테이블만 업데이트하므로
  // 각 테이블 컴포넌트는 React.memo로 메모이제이션되어 있어서
  // schedules prop이 변경되지 않으면 리렌더링되지 않음
  const value = useMemo(() => ({
    tableIds,
    schedulesMap,
    setSchedulesMap: wrappedSetSchedulesMap,
    updateTableSchedules,
    getSchedulesMapSize,
  }), [tableIds, schedulesMap, wrappedSetSchedulesMap, updateTableSchedules, getSchedulesMapSize]);

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
