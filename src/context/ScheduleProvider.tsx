import { PropsWithChildren, useState } from 'react';
import { Schedule } from '../types';
import {
  ScheduleStateContext,
  ScheduleDispatchContext,
} from './ScheduleContext';
import dummyScheduleMap from '../dummyScheduleMap';

export const ScheduleProvider = ({ children }: PropsWithChildren) => {
  const [schedulesMap, setSchedulesMap] =
    useState<Record<string, Schedule[]>>(dummyScheduleMap);

  // 두 Context를 분리하여 제공
  // - State 구독자: schedulesMap 변경 시 리렌더링
  // - Dispatch 구독자: 리렌더링 없음 (setSchedulesMap은 안정적)
  return (
    <ScheduleStateContext.Provider value={schedulesMap}>
      <ScheduleDispatchContext.Provider value={setSchedulesMap}>
        {children}
      </ScheduleDispatchContext.Provider>
    </ScheduleStateContext.Provider>
  );
};
