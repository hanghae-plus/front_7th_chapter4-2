import { Lecture } from "./types";
import { requestWithCache } from "./utils";

export const fetchMajors = () =>
  requestWithCache<Lecture[]>("./schedules-majors.json");
export const fetchLiberalArts = () =>
  requestWithCache<Lecture[]>("./schedules-liberal-arts.json");

export const fetchAllLectures = async () =>
  await Promise.all([
    (console.log("API Call 1", performance.now()), await fetchMajors()),
    (console.log("API Call 2", performance.now()), await fetchLiberalArts()),
    (console.log("API Call 3", performance.now()), await fetchMajors()),
    (console.log("API Call 4", performance.now()), await fetchLiberalArts()),
    (console.log("API Call 5", performance.now()), await fetchMajors()),
    (console.log("API Call 6", performance.now()), await fetchLiberalArts()),
  ]);
