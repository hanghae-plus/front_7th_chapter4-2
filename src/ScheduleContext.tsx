/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import dummyScheduleMap from "./dummyScheduleMap";
import { Schedule } from "./types";

type SchedulesMap = Record<string, Schedule[]>;
type SetSchedulesMap = React.Dispatch<React.SetStateAction<SchedulesMap>>;

const ScheduleQueryContext = createContext<SchedulesMap | undefined>(undefined);
const ScheduleCommandContext = createContext<SetSchedulesMap | undefined>(
  undefined
);

ScheduleQueryContext.displayName = "ScheduleQueryContext";
ScheduleCommandContext.displayName = "ScheduleCommandContext";

const useContextSafely = <T,>(
  context: React.Context<T | undefined>,
  contextName: string
): T => {
  const value = useContext(context);
  if (value === undefined) {
    throw new Error(
      `${contextName}를 사용하려면 ScheduleProvider 내부에서 사용해야 합니다`
    );
  }
  return value;
};

export const useScheduleQueryContext = () =>
  useContextSafely(ScheduleQueryContext, "Schedule Query");

export const useScheduleCommandContext = () =>
  useContextSafely(ScheduleCommandContext, "Schedule Command");

export const useScheduleContext = () => ({
  schedulesMap: useScheduleQueryContext(),
  setSchedulesMap: useScheduleCommandContext(),
});

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] = useState<SchedulesMap>(
    () => dummyScheduleMap
  );

  return (
    <ScheduleCommandContext.Provider value={setSchedulesMap}>
      <ScheduleQueryContext.Provider value={schedulesMap}>
        {children}
      </ScheduleQueryContext.Provider>
    </ScheduleCommandContext.Provider>
  );
};
