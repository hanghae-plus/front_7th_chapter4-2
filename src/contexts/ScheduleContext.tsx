import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { Schedule } from '@/types';
import dummyScheduleMap from '@/data/dummyScheduleMap';

type SchedulesMap = Record<string, Schedule[]>;

// Query Context - 값 조회용 (값 변경 시 리렌더링 발생)
const ScheduleQueryContext = createContext<SchedulesMap | undefined>(undefined);

// Command Context - 값 변경용 (setter는 동일 참조 유지)
const ScheduleCommandContext = createContext<
  React.Dispatch<React.SetStateAction<SchedulesMap>> | undefined
>(undefined);

// 기존 호환성 유지를 위한 통합 훅
export const useScheduleContext = () => {
  const schedulesMap = useContext(ScheduleQueryContext);
  const setSchedulesMap = useContext(ScheduleCommandContext);

  if (schedulesMap === undefined || setSchedulesMap === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }

  return { schedulesMap, setSchedulesMap };
};

// Query 전용 훅 - 값 조회만 필요할 때
export const useScheduleQuery = () => {
  const schedulesMap = useContext(ScheduleQueryContext);

  if (schedulesMap === undefined) {
    throw new Error('useScheduleQuery must be used within a ScheduleProvider');
  }

  return schedulesMap;
};

// Command 전용 훅 - 값 변경만 필요할 때 (리렌더링 최소화)
export const useScheduleCommand = () => {
  const setSchedulesMap = useContext(ScheduleCommandContext);

  if (setSchedulesMap === undefined) {
    throw new Error('useScheduleCommand must be used within a ScheduleProvider');
  }

  return setSchedulesMap;
};

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<SchedulesMap>(dummyScheduleMap);

  return (
    <ScheduleCommandContext.Provider value={setSchedulesMap}>
      <ScheduleQueryContext.Provider value={schedulesMap}>
        {children}
      </ScheduleQueryContext.Provider>
    </ScheduleCommandContext.Provider>
  );
};
