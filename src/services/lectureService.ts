import { Lecture } from "../types.ts";
import majorsData from '../../public/schedules-majors.json';
import liberalArtsData from '../../public/schedules-liberal-arts.json';

let cachedLectures: Lecture[] | null = null;

export const fetchAllLectures = async (): Promise<Lecture[]> => {
  if (cachedLectures) {
    return cachedLectures;
  }

  // JSON 파일을 직접 import로 가져옴
  cachedLectures = [...majorsData, ...liberalArtsData];
  return cachedLectures;
};