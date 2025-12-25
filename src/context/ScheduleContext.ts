import { createContext } from 'react';
import { Schedule } from '../types';

// State Context - schedulesMap 변경 시 구독자 리렌더링
export type SchedulesMap = Record<string, Schedule[]>;

export const ScheduleStateContext = createContext<SchedulesMap | undefined>(
  undefined,
);

// Dispatch Context - setSchedulesMap은 안정적이므로 구독자 리렌더링 없음
export type ScheduleDispatch = React.Dispatch<
  React.SetStateAction<SchedulesMap>
>;

export const ScheduleDispatchContext = createContext<
  ScheduleDispatch | undefined
>(undefined);
