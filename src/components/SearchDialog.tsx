import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { useScheduleActions } from "../ScheduleContext.tsx";
import { Lecture } from "../types.ts";
import { parseSchedule } from "../utils.ts";
import { apiClient } from "../hook/CallAPI.ts";
import { Lectures } from "./search/Lectures.tsx";
import SearchInput from "./search/SearchInput.tsx";
import SearchCredit from "./search/SearchCredit.tsx";
import SearchGrade from "./search/SearchGrade.tsx";
import SearchDay from "./search/SearchDay.tsx";
import SearchTime from "./search/SearchTime.tsx";
import SearchMajor from "./search/SearchMajor.tsx";
interface Props {
  isOpen: boolean;
  tableId: string | null;
  initialDay?: string;
  initialTime?: number;
  onClose: () => void;
}
interface SearchOption {
  query?: string;
  grades: number[];
  days: string[];
  times: number[];
  majors: string[];
  credits?: number;
}
const PAGE_SIZE = 100;

const BASE_URL = process.env.NODE_ENV === "production" ? "/front_7th_chapter4-2" : "";

const fetchMajors = () => apiClient.get<Lecture[]>(`${BASE_URL}/schedules-majors.json`);
const fetchLiberalArts = () => apiClient.get<Lecture[]>(`${BASE_URL}/schedules-liberal-arts.json`);

const fetchAllLectures = async () =>
    await Promise.all([
      (console.log("API Call 1", performance.now()), fetchMajors()),
      (console.log("API Call 2", performance.now()), fetchLiberalArts()),
    ]);

const SearchDialog = ({
                        isOpen,
                        tableId,
                        initialDay,
                        initialTime,
                        onClose,
                      }: Props) => {
  const { setSchedulesMap } = useScheduleActions();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: "",
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  const lecturesWithParsedSchedules = useMemo(() => {
    return lectures.map((lecture) => ({
      ...lecture,
      parsedSchedules: lecture.schedule ? parseSchedule(lecture.schedule) : [],
    }));
  }, [lectures]);
  
  const getFilteredLectures = useMemo(() => {
    const { query = "", credits, grades, days, times, majors } = searchOptions;
    const queryLower = query.toLowerCase();
    return lecturesWithParsedSchedules.filter((lecture) => {
        
      // 강의명 필터링
      if (query && !(lecture.title.toLowerCase().includes(queryLower) || lecture.id.toLowerCase().includes(queryLower))) {
        return false;
      }
      // 학점 필터링
      if (grades.length > 0 && !grades.includes(lecture.grade)) {
        return false;
      }
      // 전공 필터링
      if (majors.length > 0 && !majors.includes(lecture.major)) {
        return false;
      }
      // 학점 필터링
      if (credits && !lecture.credits.startsWith(String(credits))) {
        return false;
      }
      // 요일 필터링
      if (days.length > 0) {
        if (!lecture.parsedSchedules.some((s) => days.includes(s.day))) {
          return false;
        }
      }
      // 시간 필터링
      if (times.length > 0) {
        if (!lecture.parsedSchedules.some((s) => s.range.some((time) => times.includes(time)))) {
          return false;
        }
      }
      return true;
    });
  }, [lecturesWithParsedSchedules, searchOptions]);

  const filteredLectures = useMemo(
      () => getFilteredLectures,
      [getFilteredLectures]
  );
  const lastPage = useMemo(
      () => Math.ceil(filteredLectures.length / PAGE_SIZE),
      [filteredLectures]
  );
  const visibleLectures = useMemo(
      () => filteredLectures.slice(0, page * PAGE_SIZE),
      [filteredLectures, page]
  );
  const allMajors = useMemo(
      () => [...new Set(lectures.map((lecture) => lecture.major))],
      [lectures]
  );
  const changeSearchOption = useCallback(
      (field: keyof SearchOption, value: SearchOption[typeof field]) => {
        setPage(1);
        setSearchOptions((prev) => ({ ...prev, [field]: value }));
        loaderWrapperRef.current?.scrollTo(0, 0);
      },
      []
  );
  
  // 과목명 검색
  const searchTitleOrCode = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        changeSearchOption("query", e.target.value);
      }, [changeSearchOption]
  );
  // 학점 선택
  const selectCredit = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
        changeSearchOption("credits", e.target.value);
      }, [changeSearchOption]
  );
  // 학년 선택
  const selectGrades = useCallback((value: (string | number)[]) => {
        changeSearchOption("grades", value.map(Number));
      }, [changeSearchOption]
  );
  // 요일 선택
  const selectDays = useCallback((value: (string | number)[]) => {
        changeSearchOption("days", value as string[]);
      }, [changeSearchOption]
  );
  // 시간 선택
  const selectTimes = useCallback((values: (string | number)[]) => {
        changeSearchOption("times", values.map(Number));
      }, [changeSearchOption]
  );
  // 전공 선택
  const selectMajors = useCallback((values: (string | number)[]) => {
        changeSearchOption("majors", values as string[]);
      }, [changeSearchOption]
  );

  // 시간 초기화
  const removeTimeFilter = useCallback((timeToRemove: number) => {
        changeSearchOption("times", searchOptions.times.filter((v) => v !== timeToRemove));
      }, [changeSearchOption, searchOptions.times]
  );
  // 전공 초기화
  const removeMajorFilter = useCallback((majorToRemove: string) => {
        changeSearchOption("majors", searchOptions.majors.filter((v) => v !== majorToRemove));
      }, [changeSearchOption, searchOptions.majors]
  );

  const addSchedule = useCallback((lecture: Lecture) => {
        if (!tableId) return;

        const schedules = parseSchedule(lecture.schedule).map((schedule) => ({
          ...schedule,
          lecture,
        }));
        setSchedulesMap((prev) => ({
          ...prev,
          [tableId]: [...prev[tableId], ...schedules],
        }));
        onClose();
      }, [tableId, setSchedulesMap, onClose]
  );

  // Mounted
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

  // 페이징
  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;
    if (!$loader || !$loaderWrapper) {
      return;
    }
    const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            setPage((prevPage) => Math.min(lastPage, prevPage + 1));
          }
        },
        { threshold: 0, root: $loaderWrapper }
    );
    observer.observe($loader);
    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setSearchOptions((prev) => ({
      ...prev,
      days: initialDay ? [initialDay] : [],
      times: initialTime ? [initialTime] : [],
    }));
    setPage(1);
  }, [initialDay, initialTime]);
  
  return (
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent maxW="90vw" w="1000px">
          <ModalHeader>수업 검색</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              <HStack spacing={4}>
                <SearchInput
                    query={searchOptions.query}
                    searchTitleOrCode={searchTitleOrCode}
                />
                <SearchCredit
                    credits={searchOptions.credits}
                    selectCredit={selectCredit}
                />
              </HStack>
              <HStack spacing={4}>
                <SearchGrade
                    grades={searchOptions.grades}
                    selectGrades={selectGrades}
                />
                <SearchDay
                    days={searchOptions.days}
                    selectDays={selectDays}
                />
              </HStack>
              <HStack spacing={4}>
                <SearchTime
                    times={searchOptions.times}
                    selectTimes={selectTimes}
                    removeTimeFilter={removeTimeFilter}
                />
                <SearchMajor
                    majors={searchOptions.majors}
                    selectMajors={selectMajors}
                    removeMajorFilter={removeMajorFilter}
                    allMajors={allMajors}
                />
              </HStack>
              <Text align="right">검색결과: {filteredLectures.length}개</Text>
              <Box>
                <Table>
                  <Thead>
                    <Tr>
                      <Th width="100px">과목코드</Th>
                      <Th width="50px">학년</Th>
                      <Th width="200px">과목명</Th>
                      <Th width="50px">학점</Th>
                      <Th width="150px">전공</Th>
                      <Th width="150px">시간</Th>
                      <Th width="80px"></Th>
                    </Tr>
                  </Thead>
                </Table>
                <Box overflowY="auto" maxH="500px" ref={loaderWrapperRef}>
                  <Table size="sm" variant="striped">
                    <Tbody>
                      {visibleLectures.map((lecture, index) => (
                          <Lectures
                              key={`${lecture.id}-${index}`}
                              {...lecture}
                              addSchedule={addSchedule}
                          />
                      ))}
                    </Tbody>
                  </Table>
                  <Box
                      ref={(e) => {
                        loaderRef.current = e;
                      }}
                      h="20px"
                  />
                </Box>
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
  );
};
export default memo(SearchDialog);