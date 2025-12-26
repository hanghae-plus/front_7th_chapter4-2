import { useEffect, useMemo, useState } from "react";
import { fetchAllLectures } from "../../../api/lectures.ts";
import { Lecture, SearchOption } from "../../../types.ts";
import { parseSchedule } from "../../../utils.ts";

export const useLectures = (searchOptions: SearchOption) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);

  useEffect(() => {
    const start = performance.now();
    console.log("API 호출 시작: ", start);
    fetchAllLectures().then((results) => {
      const end = performance.now();
      console.log("모든 API 호출 완료 ", end);
      console.log("API 호출에 걸린 시간(ms): ", end - start);
      setLectures(results.flatMap((result) => result.data));
    });
  }, []);

  const filteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    const loweredQuery = query.toLowerCase();

    return lectures
      .filter(
        (lecture) =>
          lecture.title.toLowerCase().includes(loweredQuery) ||
          lecture.id.toLowerCase().includes(loweredQuery),
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => days.includes(s.day));
      })
      .filter((lecture) => {
        if (times.length === 0) {
          return true;
        }
        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        return schedules.some((s) => s.range.some((time) => times.includes(time)));
      });
  }, [lectures, searchOptions]);

  const allMajors = useMemo(
    () => [...new Set(lectures.map((lecture) => lecture.major))],
    [lectures],
  );

  return { filteredLectures, allMajors };
};

