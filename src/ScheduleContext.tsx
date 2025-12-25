import React, { createContext, PropsWithChildren, useContext, useState, useMemo, useCallback } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
  addSchedule: (tableId: string, schedules: Schedule[]) => void;
  deleteSchedule: (tableId: string, day: string, time: number) => void;
  duplicateTable: (targetId: string) => void;
  removeTable: (tableId: string) => void;
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

  const addSchedule = useCallback((tableId: string, schedules: Schedule[]) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules]
    }));
  }, []);

  const deleteSchedule = useCallback((tableId: string, day: string, time: number) => {
    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: prev[tableId].filter(schedule => schedule.day !== day || !schedule.range.includes(time))
    }));
  }, []);

  const duplicateTable = useCallback((targetId: string) => {
    setSchedulesMap(prev => ({
      ...prev,
      [`schedule-${Date.now()}`]: [...prev[targetId]]
    }));
  }, []);

  const removeTable = useCallback((tableId: string) => {
    setSchedulesMap(prev => {
      const newMap = { ...prev };
      delete newMap[tableId];
      return newMap;
    });
  }, []);

  const value = useMemo(() => ({
    schedulesMap,
    setSchedulesMap,
    addSchedule,
    deleteSchedule,
    duplicateTable,
    removeTable
  }), [schedulesMap, addSchedule, deleteSchedule, duplicateTable, removeTable]);

  return (
    <ScheduleContext.Provider value={value}>
      {children}
    </ScheduleContext.Provider>
  );
};
