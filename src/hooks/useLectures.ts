import { useEffect, useMemo, useState } from 'react';
import { Lecture } from '../types';
import { getAllLectures } from '../api';

interface UseLecturesReturn {
  lectures: Lecture[];
  allMajors: string[];
}

const useLectures = (): UseLecturesReturn => {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    const start = performance.now();
    console.log('API 호출 시작: ', start);

    getAllLectures().then((allLectures) => {
      const end = performance.now();
      console.log('모든 API 호출 완료: ', end);
      console.log('API 호출에 걸린 시간(ms): ', end - start);
      setLectures(allLectures);
    });
  }, []);

  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures],
  );

  return { lectures, allMajors };
};

export default useLectures;
