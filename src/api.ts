import axios from 'axios';
import { Lecture } from './types';

// API 함수

const fetchMajors = () => axios.get<Lecture[]>('./schedules-majors.json');
const fetchLiberalArts = () =>
  axios.get<Lecture[]>('./schedules-liberal-arts.json');

// 캐시 로직 (Map 기반)

type CacheKey = 'majors' | 'liberalArts';

const cache = new Map<CacheKey, Promise<Lecture[]>>();

const fetchers: Record<CacheKey, () => Promise<Lecture[]>> = {
  majors: () => fetchMajors().then((res) => res.data),
  liberalArts: () => fetchLiberalArts().then((res) => res.data),
};

export function getCachedLectures(
  key: CacheKey,
  call?: number,
): Promise<Lecture[]> {
  const isCacheHit = cache.has(key);

  if (call !== undefined) {
    console.log(
      `API Call ${call} (${key})${isCacheHit ? ' [CACHE HIT]' : ' [FETCH]'}`,
      performance.now(),
    );
  }

  if (!isCacheHit) {
    cache.set(key, fetchers[key]());
  }
  return cache.get(key)!;
}

// 모든 강의 가져오기 및 캐시 히트 확인

export async function getAllLectures(): Promise<Lecture[]> {
  const results = await Promise.all([
    getCachedLectures('majors', 1),
    getCachedLectures('liberalArts', 2),
    getCachedLectures('majors', 3),
    getCachedLectures('liberalArts', 4),
    getCachedLectures('majors', 5),
    getCachedLectures('liberalArts', 6),
  ]);

  const allLectures = results.flat();

  return allLectures;
}

// 캐시 무효화

export function invalidateCache(key?: CacheKey): void {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}
