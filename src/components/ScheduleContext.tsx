import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { Schedule } from "../types";
import dummyScheduleMap from "../dummy/dummyScheduleMap.ts";

// schedulesMap과 setSchedulesMap을 분리하여 불필요한 리렌더링 방지
const SchedulesMapContext = createContext<Record<string, Schedule[]> | undefined>(undefined);
const SetSchedulesMapContext = createContext<React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>> | undefined>(undefined);

export const useSchedulesMap = () => {
  const context = useContext(SchedulesMapContext);
  if (context === undefined) {
    throw new Error("useSchedulesMap must be used within a ScheduleProvider");
  }
  return context;
};

export const useSetSchedulesMap = () => {
  const context = useContext(SetSchedulesMapContext);
  if (context === undefined) {
    throw new Error("useSetSchedulesMap must be used within a ScheduleProvider");
  }
  return context;
};

// 하위 호환성을 위한 기존 hook
export const useScheduleContext = () => {
  return {
    schedulesMap: useSchedulesMap(),
    setSchedulesMap: useSetSchedulesMap(),
  };
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
    <SchedulesMapContext.Provider value={schedulesMap}>
      <SetSchedulesMapContext.Provider value={setSchedulesMap}>
        {children}
      </SetSchedulesMapContext.Provider>
    </SchedulesMapContext.Provider>
  );
};
