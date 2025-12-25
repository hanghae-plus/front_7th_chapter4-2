import { Lecture } from "../types.ts";
import { parseSchedule } from "../utils.ts";

export interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}

/**
 * 강의 목록을 검색 옵션에 따라 필터링합니다.
 * 여러 개의 .filter() 체이닝을 하나의 순회로 통합하여 성능을 최적화합니다.
 *
 * @param lectures - 필터링할 강의 목록
 * @param searchOptions - 검색 옵션
 * @returns 필터링된 강의 목록
 */
export const filterLectures = (
  lectures: Lecture[],
  searchOptions: SearchOption
): Lecture[] => {
  const { query = "", credits, grades, days, times, majors } = searchOptions;
  const queryLower = query.toLowerCase();

  return lectures.filter((lecture) => {
    // 검색어 필터
    if (
      query &&
      !lecture.title.toLowerCase().includes(queryLower) &&
      !lecture.id.toLowerCase().includes(queryLower)
    ) {
      return false;
    }

    // 학년 필터
    if (grades.length > 0 && !grades.includes(lecture.grade)) {
      return false;
    }

    // 전공 필터
    if (majors.length > 0 && !majors.includes(lecture.major)) {
      return false;
    }

    // 학점 필터
    if (credits && !lecture.credits.startsWith(String(credits))) {
      return false;
    }

    // 요일 필터
    if (days.length > 0) {
      const schedules = lecture.schedule
        ? parseSchedule(lecture.schedule)
        : [];
      if (!schedules.some((s) => days.includes(s.day))) {
        return false;
      }
    }

    // 시간 필터
    if (times.length > 0) {
      const schedules = lecture.schedule
        ? parseSchedule(lecture.schedule)
        : [];
      if (
        !schedules.some((s) => s.range.some((time) => times.includes(time)))
      ) {
        return false;
      }
    }

    return true;
  });
};

/**
 * 강의 목록에서 고유한 전공 목록을 추출합니다.
 *
 * @param lectures - 강의 목록
 * @returns 고유한 전공 목록 배열
 */
export const extractUniqueMajors = (lectures: Lecture[]): string[] => {
  return [...new Set(lectures.map((lecture) => lecture.major))];
};

