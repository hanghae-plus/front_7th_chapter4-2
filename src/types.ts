export interface Lecture {
  id: string;
  grade: number;
  title: string;
  credits: string;
  major: string;
  schedule: string;
}

export interface Schedule {
  day: string;
  range: number[];
  lecture: Lecture;
}

export type SchedulesMap = Record<string, Schedule[]>;

export interface SearchOption {
  query?: string,
  grades: number[],
  days: string[],
  times: number[],
  majors: string[],
  credits?: number,
}