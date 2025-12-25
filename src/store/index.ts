import { create } from "zustand";
import dummyScheduleMap from "../dummyScheduleMap";
import { Schedule } from "../types";

interface ScheduleStore {
  schedulesMap: Record<string, Schedule[]>;
  duplicateTable: (tableId: string) => void;
  updateTable: (tableId: string, schedules: Schedule[]) => void;
  removeTable: (tableId: string) => void;
  removeSchedule: (tableId: string, day: string, time: number) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => {
  return {
    schedulesMap: dummyScheduleMap,
    duplicateTable: (tableId: string) => {
      set((state: ScheduleStore) => {
        const newTableId = `schedule-${Date.now()}`;
        return {
          schedulesMap: {
            ...state.schedulesMap,
            [newTableId]: [...state.schedulesMap[tableId]],
          },
        };
      });
    },
    updateTable: (tableId: string, schedules: Schedule[]) => {
      set((state: ScheduleStore) => ({
        schedulesMap: { ...state.schedulesMap, [tableId]: schedules },
      }));
    },
    removeTable: (tableId: string) => {
      set((state: ScheduleStore) => {
        const newSchedulesMap = { ...state.schedulesMap };
        delete newSchedulesMap[tableId];
        return { schedulesMap: newSchedulesMap };
      });
    },
    removeSchedule: (tableId: string, day: string, time: number) => {
      set((state: ScheduleStore) => ({
        schedulesMap: {
          ...state.schedulesMap,
          [tableId]: state.schedulesMap[tableId].filter(
            (schedule) => schedule.day !== day || !schedule.range.includes(time)
          ),
        },
      }));
    },
  };
});
