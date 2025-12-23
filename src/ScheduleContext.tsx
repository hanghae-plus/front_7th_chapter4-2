import React, {createContext, PropsWithChildren, useContext, useMemo, useState} from "react";
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

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // value 객체를 useMemo로 감싸서 schedulesMap이 변할 때만 새로 생성되도록 함
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
