import React, { createContext, PropsWithChildren, useContext, useReducer } from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>>;
}

type ScheduleAction =
  | { type: 'SET_SCHEDULES_MAP'; updater: (prev: Record<string, Schedule[]>) => Record<string, Schedule[]> };

const scheduleReducer = (state: Record<string, Schedule[]>, action: ScheduleAction): Record<string, Schedule[]> => {
  switch (action.type) {
    case 'SET_SCHEDULES_MAP':
      return action.updater(state);
    default:
      return state;
  }
};

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, dispatch] = useReducer(scheduleReducer, dummyScheduleMap);

  const setSchedulesMap: React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>> = (updater) => {
    if (typeof updater === 'function') {
      dispatch({ type: 'SET_SCHEDULES_MAP', updater });
    } else {
      // 직접 객체를 설정하는 경우 (드물게 사용)
      dispatch({ type: 'SET_SCHEDULES_MAP', updater: () => updater });
    }
  };

  return (
    <ScheduleContext.Provider value={{ schedulesMap, setSchedulesMap }}>
      {children}
    </ScheduleContext.Provider>
  );
};
