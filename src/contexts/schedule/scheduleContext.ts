import React, { createContext, useContext } from 'react';
import { Schedule } from '@/types';

export type SchedulesMap = Record<string, Schedule[]>;

// Query Context - 값 조회용 (값 변경 시 리렌더링 발생)
export const ScheduleQueryContext = createContext<SchedulesMap | undefined>(
  undefined
);

// Command Context - 값 변경용 (setter는 동일 참조 유지)
export const ScheduleCommandContext = createContext<
  React.Dispatch<React.SetStateAction<SchedulesMap>> | undefined
>(undefined);

// 통합 훅 - 값 조회와 변경 모두 필요할 때
export const useScheduleContext = () => {
  const schedulesMap = useContext(ScheduleQueryContext);
  const setSchedulesMap = useContext(ScheduleCommandContext);

  if (schedulesMap === undefined || setSchedulesMap === undefined) {
    throw new Error(
      'useScheduleContext must be used within a ScheduleProvider'
    );
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
    throw new Error(
      'useScheduleCommand must be used within a ScheduleProvider'
    );
  }

  return setSchedulesMap;
};
