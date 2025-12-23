import { Lecture, SearchOption } from '../../../types.ts';
import { parseSchedule } from '../../../utils.ts';

// 개별 필터 함수들 (커링된 순수 함수)
const filterByQuery = (query: string = '') => (lecture: Lecture): boolean =>
  lecture.title.toLowerCase().includes(query.toLowerCase()) ||
  lecture.id.toLowerCase().includes(query.toLowerCase());

const filterByGrades = (grades: number[]) => (lecture: Lecture): boolean =>
  grades.length === 0 || grades.includes(lecture.grade);

const filterByMajors = (majors: string[]) => (lecture: Lecture): boolean =>
  majors.length === 0 || majors.includes(lecture.major);

const filterByCredits = (credits?: number) => (lecture: Lecture): boolean =>
  !credits || lecture.credits.startsWith(String(credits));

const filterByDays = (days: string[]) => (lecture: Lecture): boolean => {
  if (days.length === 0) return true;
  const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
  return schedules.some((s) => days.includes(s.day));
};

const filterByTimes = (times: number[]) => (lecture: Lecture): boolean => {
  if (times.length === 0) return true;
  const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
  return schedules.some((s) => s.range.some((time) => times.includes(time)));
};

// 필터 함수들을 합성하는 유틸리티
const composeFilters =
  <T>(...filters: ((item: T) => boolean)[]) =>
  (item: T): boolean =>
    filters.every((filter) => filter(item));

// 메인 필터 함수
export const filterLectures = (
  lectures: Lecture[],
  { query, credits, grades, days, times, majors }: SearchOption,
): Lecture[] => {
  const combinedFilter = composeFilters<Lecture>(
    filterByQuery(query),
    filterByGrades(grades),
    filterByMajors(majors),
    filterByCredits(credits),
    filterByDays(days),
    filterByTimes(times),
  );

  return lectures.filter(combinedFilter);
};
