import { createContext, PropsWithChildren, useContext } from "react";
import { Schedule } from "./types.ts";

interface ScheduleContextType {
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};

export const ScheduleProvider = ({
  children,
  schedules,
  setSchedules,
}: PropsWithChildren<{
  schedules: Schedule[];
  setSchedules: (schedules: Schedule[]) => void;
}>) => {
  return (
    <ScheduleContext.Provider value={{ schedules, setSchedules }}>
      {children}
    </ScheduleContext.Provider>
  );
};
