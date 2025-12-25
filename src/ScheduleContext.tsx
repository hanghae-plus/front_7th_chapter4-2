import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
  useMemo,
  useCallback,
} from 'react';
import { Schedule } from './types.ts';
import dummyScheduleMap from './dummyScheduleMap.ts';

interface ScheduleContextType {
  schedulesMap: Record<string, Schedule[]>;
  setSchedulesMap: React.Dispatch<
    React.SetStateAction<Record<string, Schedule[]>>
  >;
}

// schedulesMap만 제공하는 Context
const ScheduleMapContext = createContext<
  Record<string, Schedule[]> | undefined
>(undefined);

// setSchedulesMap만 제공하는 Context (드래그 시 리렌더링 방지)
const ScheduleMapActionsContext = createContext<
  React.Dispatch<React.SetStateAction<Record<string, Schedule[]>>> | undefined
>(undefined);

// 기존 호환성을 위한 통합 Context
const ScheduleContext = createContext<ScheduleContextType | undefined>(
  undefined
);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider');
  }
  return context;
};

// setSchedulesMap만 필요한 경우: schedulesMap 변경 시 리렌더링되지 않음
export const useSetSchedulesMap = () => {
  const context = useContext(ScheduleMapActionsContext);
  if (context === undefined) {
    throw new Error(
      'useSetSchedulesMap must be used within a ScheduleProvider'
    );
  }
  return context;
};

// schedulesMap만 필요한 경우
export const useSchedulesMap = () => {
  const context = useContext(ScheduleMapContext);
  if (context === undefined) {
    throw new Error('useSchedulesMap must be used within a ScheduleProvider');
  }
  return context;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // setSchedulesMap을 안정적인 함수로 메모이제이션
  const stableSetSchedulesMap = useCallback(
    (value: React.SetStateAction<Record<string, Schedule[]>>) => {
      setSchedulesMap(value);
    },
    []
  );

  // Context value를 메모이제이션하여 불필요한 리렌더링 방지
  const value = useMemo(
    () => ({
      schedulesMap,
      setSchedulesMap: stableSetSchedulesMap,
    }),
    [schedulesMap, stableSetSchedulesMap]
  );

  return (
    <ScheduleContext.Provider value={value}>
      <ScheduleMapContext.Provider value={schedulesMap}>
        <ScheduleMapActionsContext.Provider value={stableSetSchedulesMap}>
          {children}
        </ScheduleMapActionsContext.Provider>
      </ScheduleMapContext.Provider>
    </ScheduleContext.Provider>
  );
};
