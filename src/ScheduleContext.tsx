import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from "react";
import { Schedule } from "./types.ts";
import dummyScheduleMap from "./dummyScheduleMap.ts";

// State와 Dispatch를 분리하여 불필요한 리렌더링 방지
const ScheduleStateContext = createContext<
  Record<string, Schedule[]> | undefined
>(undefined);
const ScheduleDispatchContext = createContext<
  React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>> | undefined
>(undefined);

// 전체 상태를 구독 (schedulesMap 변경 시 리렌더링됨)
export const useScheduleState = () => {
  const context = useContext(ScheduleStateContext);
  if (context === undefined) {
    throw new Error("useScheduleState must be used within a ScheduleProvider");
  }
  return context;
};

// dispatch만 구독 (상태 변경 시 리렌더링 안 됨)
export const useScheduleDispatch = () => {
  const context = useContext(ScheduleDispatchContext);
  if (context === undefined) {
    throw new Error(
      "useScheduleDispatch must be used within a ScheduleProvider"
    );
  }
  return context;
};

// 특정 테이블의 스케줄만 구독 (해당 테이블 변경 시에만 리렌더링)
export const useTableSchedules = (tableId: string) => {
  const schedulesMap = useScheduleState();
  return useMemo(() => schedulesMap[tableId] || [], [schedulesMap, tableId]);
};

// 하위 호환성을 위한 기존 훅 (deprecated)
export const useScheduleContext = () => {
  const schedulesMap = useScheduleState();
  const setSchedulesMap = useScheduleDispatch();
  return { schedulesMap, setSchedulesMap };
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  return (
    <ScheduleStateContext.Provider value={schedulesMap}>
      <ScheduleDispatchContext.Provider value={setSchedulesMap}>
        {children}
      </ScheduleDispatchContext.Provider>
    </ScheduleStateContext.Provider>
  );
};
