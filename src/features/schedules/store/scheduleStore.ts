import { create } from 'zustand';
import { Lecture, Schedule } from '../../../types';
import { parseSchedule } from '../../../utils';
import dummyScheduleMap from '../dummyScheduleMap';
import { DAY_LABELS } from '../../../constants';

interface ScheduleStore {
  schedulesMap: Record<string, Schedule[]>;

  // 테이블 관련 액션
  duplicateTable: (tableId: string) => void;
  removeTable: (tableId: string) => void;

  // 스케줄 관련 액션
  addSchedule: (tableId: string, lecture: Lecture) => void;
  removeSchedule: (tableId: string, day: string, time: number) => void;
  moveSchedule: (
    tableId: string,
    index: number,
    moveDayIndex: number,
    moveTimeIndex: number,
  ) => void;
}

export const useScheduleStore = create<ScheduleStore>((set) => ({
  schedulesMap: dummyScheduleMap,

  duplicateTable: (tableId) =>
    set((state) => ({
      schedulesMap: {
        ...state.schedulesMap,
        [`schedule-${Date.now()}`]: [...state.schedulesMap[tableId]],
      },
    })),

  removeTable: (tableId) =>
    set((state) => {
      const newMap = { ...state.schedulesMap };
      delete newMap[tableId];
      return { schedulesMap: newMap };
    }),

  addSchedule: (tableId, lecture) =>
    set((state) => {
      const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
        ...schedule,
        lecture,
      }));
      return {
        schedulesMap: {
          ...state.schedulesMap,
          [tableId]: [...state.schedulesMap[tableId], ...schedules],
        },
      };
    }),

  removeSchedule: (tableId, day, time) =>
    set((state) => ({
      schedulesMap: {
        ...state.schedulesMap,
        [tableId]: state.schedulesMap[tableId].filter(
          (schedule) => schedule.day !== day || !schedule.range.includes(time),
        ),
      },
    })),

  moveSchedule: (tableId, index, moveDayIndex, moveTimeIndex) =>
    set((state) => {
      const schedule = state.schedulesMap[tableId][index];
      const nowDayIndex = DAY_LABELS.indexOf(
        schedule.day as (typeof DAY_LABELS)[number],
      );

      return {
        schedulesMap: {
          ...state.schedulesMap,
          [tableId]: state.schedulesMap[tableId].map((s, i) => {
            if (i !== index) return s;
            return {
              ...s,
              day: DAY_LABELS[nowDayIndex + moveDayIndex],
              range: s.range.map((time) => time + moveTimeIndex),
            };
          }),
        },
      };
    }),
}));
