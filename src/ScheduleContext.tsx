import React, { createContext, PropsWithChildren, useContext, useState, useMemo } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
}

interface ScheduleDispatchContextType {
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

// 1. Context 분리
const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);
const ScheduleDispatchContext = createContext<ScheduleDispatchContextType | undefined>(undefined);

// 2. Hook 분리
export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
};

export const useScheduleDispatch = () => {
  const context = useContext(ScheduleDispatchContext);
  if (context === undefined) {
    throw new Error('useScheduleDispatch must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // 3. Value 메모이제이션 (중요!)
  const scheduleValue = useMemo(() => ({ schedulesMap }), [schedulesMap]);
  const dispatchValue = useMemo(() => ({ setSchedulesMap }), []); // setSchedulesMap은 영원히 변하지 않음

  return (
    <ScheduleContext.Provider value={scheduleValue}>
      <ScheduleDispatchContext.Provider value={dispatchValue}>
        {children}
      </ScheduleDispatchContext.Provider>
    </ScheduleContext.Provider>
  );
};