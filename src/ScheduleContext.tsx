import React, { createContext, PropsWithChildren, useContext, useState } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

// const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const ScheduleCommandContext = createContext<ScheduleContextType["setSchedulesMap"] | undefined>(
  undefined
);
const ScheduleQueryContext = createContext<ScheduleContextType["schedulesMap"] | undefined>(
  undefined
);

// export const useScheduleContext = () => {
//   // const context = useContext(ScheduleContext);
//   // if (context === undefined) {
//   //   throw new Error("useSchedule must be used within a ScheduleProvider");
//   // }
//   // return context;

//   const commandContext = useContext(ScheduleCommandContext);
//   const queryContext = useContext(ScheduleQueryContext);

//   if (commandContext === undefined || queryContext === undefined) {
//     throw new Error("useSchedule must be used within a ScheduleProvider");
//   }
//   return { schedulesMap: queryContext, setSchedulesMap: commandContext };
// };

export const useScheduleCommand = () => {
  const commandContext = useContext(ScheduleCommandContext);
  if (commandContext === undefined) {
    throw new Error("useScheduleCommand must be used within a ScheduleProvider");
  }
  return commandContext;
};

export const useScheduleQuery = () => {
  const queryContext = useContext(ScheduleQueryContext);
  if (queryContext === undefined) {
    throw new Error("useScheduleQuery must be used within a ScheduleProvider");
  }
  return queryContext;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
    <ScheduleCommandContext.Provider value={setSchedulesMap}>
      <ScheduleQueryContext.Provider value={schedulesMap}>{children}</ScheduleQueryContext.Provider>
    </ScheduleCommandContext.Provider>
  );
};
