import { useMemo } from "react";
import { Lecture } from "../types.ts";
import {
  filterLectures,
  extractUniqueMajors,
  SearchOption,
} from "../utils/filterLectures.ts";

const PAGE_SIZE = 100;

interface UseFilteredLecturesOptions {
  lectures: Lecture[];
  searchOptions: SearchOption;
  page: number;
}

interface UseFilteredLecturesReturn {
  filteredLectures: Lecture[];
  visibleLectures: Lecture[];
  allMajors: string[];
  lastPage: number;
}

/**
 * 강의 목록을 필터링하고 페이지네이션을 처리하는 커스텀 훅입니다.
 * useMemo를 사용하여 불필요한 재계산을 방지합니다.
 *
 * @param options - 강의 목록, 검색 옵션, 현재 페이지
 * @returns 필터링된 강의 목록, 보이는 강의 목록, 전공 목록, 전체 페이지 수
 */
export const useFilteredLectures = ({
  lectures,
  searchOptions,
  page,
}: UseFilteredLecturesOptions): UseFilteredLecturesReturn => {
  // 필터링된 강의 목록을 useMemo로 메모이제이션
  // searchOptions나 lectures가 변경될 때만 재계산
  const filteredLectures = useMemo(
    () => filterLectures(lectures, searchOptions),
    [lectures, searchOptions]
  );

  // 전체 페이지 수 계산을 useMemo로 메모이제이션
  const lastPage = useMemo(
    () => Math.ceil(filteredLectures.length / PAGE_SIZE),
    [filteredLectures.length]
  );

  // 현재 페이지에 보이는 강의 목록을 useMemo로 메모이제이션
  const visibleLectures = useMemo(
    () => filteredLectures.slice(0, page * PAGE_SIZE),
    [filteredLectures, page]
  );

  // 모든 전공 목록을 useMemo로 메모이제이션
  const allMajors = useMemo(
    () => extractUniqueMajors(lectures),
    [lectures]
  );

  return {
    filteredLectures,
    visibleLectures,
    allMajors,
    lastPage,
  };
};

