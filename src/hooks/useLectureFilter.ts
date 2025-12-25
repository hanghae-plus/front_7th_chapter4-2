import { useMemo } from 'react';
import { Lecture } from '../types';
import { parseSchedule } from '../utils';
import { SearchOption } from './useSearchOptions';

interface UseLectureFilterReturn {
  filteredLectures: Lecture[];
  totalCount: number;
}

const useLectureFilter = (
  lectures: Lecture[],
  searchOptions: SearchOption,
): UseLectureFilterReturn => {
  const filteredLectures = useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;

    return lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(query.toLowerCase()) ||
          lecture.id.toLowerCase().includes(query.toLowerCase()),
      )
      .filter(
        (lecture) => grades.length === 0 || grades.includes(lecture.grade),
      )
      .filter(
        (lecture) => majors.length === 0 || majors.includes(lecture.major),
      )
      .filter(
        (lecture) => !credits || lecture.credits.startsWith(String(credits)),
      )
      .filter((lecture) => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule
          ? parseSchedule(lecture.schedule)
          : [];
        return schedules.some((s) =>
          s.range.some((time) => times.includes(time)),
        );
      });
  }, [lectures, searchOptions]);

  return {
    filteredLectures,
    totalCount: filteredLectures.length,
  };
};

export default useLectureFilter;
