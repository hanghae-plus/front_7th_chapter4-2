import axios, { AxiosResponse } from 'axios';
import { Lecture } from '../types';

const fetchMajors = () => axios.get<Lecture[]>('/schedules-majors.json');
const fetchLiberalArts = () =>
  axios.get<Lecture[]>('/schedules-liberal-arts.json');

// TODO: 이 코드를 개선해서 API 호출을 최소화 해보세요 + Promise.all이 현재 잘못 사용되고 있습니다. 같이 개선해주세요.
// NOTE: Promise.all([Promise1, Promise2,,, ])와 같은 형태여야 한다.
export const fetchAllLectures = async () => {
  const fetchMap: Map<string, () => Promise<AxiosResponse<Lecture[]>>> =
    new Map();

  if (!fetchMap.has('majors')) {
    fetchMap.set('majors', fetchMajors);
  }
  if (!fetchMap.has('liberalArts')) {
    fetchMap.set('liberalArts', fetchLiberalArts);
  }

  return await Promise.all([
    (console.log('API Call 1', performance.now()), fetchMajors()),
    (console.log('API Call 2', performance.now()), fetchLiberalArts()),
    (console.log('API Call 3', performance.now()), fetchMajors()),
    (console.log('API Call 4', performance.now()), fetchLiberalArts()),
    (console.log('API Call 5', performance.now()), fetchMajors()),
    (console.log('API Call 6', performance.now()), fetchLiberalArts()),
  ]);
};
