import axios from 'axios';
import { Lecture } from '../types';

const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
const fetchLiberalArts = () => axios.get<Lecture[]>('/schedules-liberal-arts.json');

// 캐시 저장소
let lecturesCache: Lecture[] | null = null;
let fetchPromise: Promise<Lecture[]> | null = null;

export const fetchAllLectures = async (): Promise<Lecture[]> => {
  // 이미 캐시된 데이터가 있으면 반환
  if (lecturesCache) {
    return lecturesCache;
  }

  // 이미 진행 중인 요청이 있으면 해당 Promise 반환 (중복 호출 방지)
  if (fetchPromise) {
    return fetchPromise;
  }

  // 새로운 요청 시작
  fetchPromise = (async () => {
    const results = await Promise.all([
      fetchMajors(),
      fetchLiberalArts(),
      fetchMajors(),
      fetchLiberalArts(),
      fetchMajors(),
      fetchLiberalArts(),
    ]);
    const lectures = results.flatMap((result) => result.data);
    lecturesCache = lectures;

    return lectures;
  })();

  return fetchPromise;
};

// 캐시 초기화 (필요한 경우 사용)
export const clearLecturesCache = () => {
  lecturesCache = null;
  fetchPromise = null;
};
