import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

type ScheduleContextType = Record<string, Schedule[]>;

type SetScheduleContextType = React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;

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

  return (
    <SetScheduleContext.Provider value={setSchedulesMap}>
      <ScheduleContext.Provider value={schedulesMap}>{children}</ScheduleContext.Provider>
    </SetScheduleContext.Provider>
  );
};
