import { PropsWithChildren, useState } from 'react';
import dummyScheduleMap from '@/data/dummyScheduleMap';
import {
  ScheduleQueryContext,
  ScheduleCommandContext,
  SchedulesMap,
} from './scheduleContext';

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
