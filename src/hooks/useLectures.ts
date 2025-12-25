import { useEffect, useState } from "react";
import { Lecture } from "../types.ts";
import { getLectures } from "../services/lectureService.ts";

/**
 * 강의 데이터를 가져오는 커스텀 훅입니다.
 * 캐시를 활용하여 한 번 불러온 데이터는 재호출하지 않습니다.
 *
 * @returns 강의 데이터 배열과 로딩 상태
 */
export const useLectures = () => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadLectures = async () => {
      try {
        setIsLoading(true);
        const start = performance.now();
        console.log("API 호출 시작: ", start);

        const data = await getLectures();

        const end = performance.now();
        console.log("모든 API 호출 완료 ", end);
        console.log("API 호출에 걸린 시간(ms): ", end - start);

        setLectures(data);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("강의 데이터를 불러오는데 실패했습니다.");
        setError(error);
        console.error("강의 데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLectures();
  }, []);

  return { lectures, isLoading, error };
};

