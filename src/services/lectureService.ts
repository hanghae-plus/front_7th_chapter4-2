import axios from "axios";
import { Lecture } from "../types.ts";

/**
 * Base URL을 가져옵니다.
 * GitHub Pages 경로를 올바르게 처리하기 위해 현재 경로의 base를 추출합니다.
 */
const getBaseUrl = () => {
  // window.location.pathname에서 base path 추출
  // 예: '/front_7th_chapter4-2/' -> '/front_7th_chapter4-2'
  const pathname = window.location.pathname;
  // 루트 경로가 아닌 경우 base path 반환
  if (pathname !== '/' && pathname.endsWith('/')) {
    return pathname.slice(0, -1);
  }
  return pathname !== '/' ? pathname : '';
};

/**
 * 전공 강의 목록을 가져옵니다.
 */
const fetchMajors = () => axios.get<Lecture[]>(`${getBaseUrl()}/schedules-majors.json`);

/**
 * 교양 강의 목록을 가져옵니다.
 */
const fetchLiberalArts = () =>
  axios.get<Lecture[]>(`${getBaseUrl()}/schedules-liberal-arts.json`);

/**
 * 강의 데이터 캐시
 * 한 번 불러온 강의 데이터를 모듈 단위에서 캐시하여
 * 재호출을 방지합니다.
 */
let lecturesCache: Lecture[] | null = null;

/**
 * 모든 강의 데이터를 병렬로 가져옵니다.
 * Promise.all을 사용하여 두 API를 동시에 호출하여 성능을 최적화합니다.
 *
 * @returns 강의 데이터 배열을 포함하는 Promise
 */
export const fetchAllLectures = async (): Promise<Lecture[]> => {
  const results = await Promise.all([fetchMajors(), fetchLiberalArts()]);
  return results.flatMap((result) => result.data);
};

/**
 * 캐시된 강의 데이터를 가져옵니다.
 * 캐시가 없으면 API를 호출하여 데이터를 가져오고 캐시에 저장합니다.
 *
 * @returns 강의 데이터 배열을 포함하는 Promise
 */
export const getLectures = async (): Promise<Lecture[]> => {
  // 캐시가 있다면 API 호출 없이 캐시된 데이터 반환
  if (lecturesCache && lecturesCache.length > 0) {
    return lecturesCache;
  }

  // 캐시가 없으면 API 호출
  const lectures = await fetchAllLectures();
  lecturesCache = lectures;
  return lectures;
};

/**
 * 강의 데이터 캐시를 초기화합니다.
 * 데이터가 업데이트되었을 때 캐시를 무효화하기 위해 사용합니다.
 */
export const clearLecturesCache = (): void => {
  lecturesCache = null;
};

