import { createContext, Dispatch, SetStateAction, useContext } from 'react';
import { Schedule } from '../types/schedule.ts';

type ScheduleContextType = Record<string, Schedule[]>;
type ScheduleActionType = Dispatch<SetStateAction<ScheduleContextType>>;

export const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);
export const ScheduleAction = createContext<ScheduleActionType | undefined>(undefined);

export const useScheduleContext = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useScheduleContext must be used within a ScheduleProvider');
  }
  return context;
};

export const useScheduleAction = () => {
  const context = useContext(ScheduleAction);
  if (context === undefined) {
    throw new Error('useScheduleAction must be used within a ScheduleProvider');
  }
  return context;
};
