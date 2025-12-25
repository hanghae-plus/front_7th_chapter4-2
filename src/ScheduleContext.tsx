import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
}

interface SetScheduleContextType {
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);
const SetScheduleContext = createContext<SetScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const useSetScheduleContext = () => {
  const context = useContext(SetScheduleContext);
  if (context === undefined) {
    throw new Error("useSetSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  const scheduleValue = useMemo(() => ({ schedulesMap }), [schedulesMap]);
  const setScheduleValue = useMemo(() => ({ setSchedulesMap }), [setSchedulesMap]);

  return (
    <SetScheduleContext.Provider value={setScheduleValue}>
      <ScheduleContext.Provider value={scheduleValue}>{children}</ScheduleContext.Provider>
    </SetScheduleContext.Provider>
  );
};
