import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { useScheduleContext } from "./ScheduleContext.tsx";
import { Lecture } from "./types.ts";
import { parseSchedule } from "./utils.ts";
import axios from "axios";
import { DAY_LABELS } from "./constants.ts";

interface Props {
  searchInfo: {
    tableId: string;
    day?: string;
    time?: number;
  } | null;
  onClose: () => void;
}

interface SearchOption {
  query?: string,
  grades: number[],
  days: string[],
  times: number[],
  majors: string[],
  credits?: number,
}

const TIME_SLOTS = [
  { id: 1, label: "09:00~09:30" },
  { id: 2, label: "09:30~10:00" },
  { id: 3, label: "10:00~10:30" },
  { id: 4, label: "10:30~11:00" },
  { id: 5, label: "11:00~11:30" },
  { id: 6, label: "11:30~12:00" },
  { id: 7, label: "12:00~12:30" },
  { id: 8, label: "12:30~13:00" },
  { id: 9, label: "13:00~13:30" },
  { id: 10, label: "13:30~14:00" },
  { id: 11, label: "14:00~14:30" },
  { id: 12, label: "14:30~15:00" },
  { id: 13, label: "15:00~15:30" },
  { id: 14, label: "15:30~16:00" },
  { id: 15, label: "16:00~16:30" },
  { id: 16, label: "16:30~17:00" },
  { id: 17, label: "17:00~17:30" },
  { id: 18, label: "17:30~18:00" },
  { id: 19, label: "18:00~18:50" },
  { id: 20, label: "18:55~19:45" },
  { id: 21, label: "19:50~20:40" },
  { id: 22, label: "20:45~21:35" },
  { id: 23, label: "21:40~22:30" },
  { id: 24, label: "22:35~23:25" },
];

const PAGE_SIZE = 100;

// 전공 체크박스 컴포넌트 - React.memo로 메모이제이션
const MajorCheckbox = memo(({ major }: { major: string }) => {
  return (
    <Box>
      <Checkbox size="sm" value={major}>
        {major.replace(/<p>/gi, ' ')}
      </Checkbox>
    </Box>
  );
});

// 강의 행 컴포넌트 - React.memo로 메모이제이션
const LectureRow = memo(({
  lecture,
  onAddSchedule
}: {
  lecture: Lecture;
  onAddSchedule: (lecture: Lecture) => void;
}) => {
  return (
    <Tr>
      <Td width="100px">{lecture.id}</Td>
      <Td width="50px">{lecture.grade}</Td>
      <Td width="200px">{lecture.title}</Td>
      <Td width="50px">{lecture.credits}</Td>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.major }}/>
      <Td width="150px" dangerouslySetInnerHTML={{ __html: lecture.schedule }}/>
      <Td width="80px">
        <Button size="sm" colorScheme="green" onClick={() => onAddSchedule(lecture)}>추가</Button>
      </Td>
    </Tr>
  );
});

// 검색어 입력 컴포넌트
const SearchQueryInput = memo(({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) => (
  <FormControl>
    <FormLabel>검색어</FormLabel>
    <Input
      placeholder="과목명 또는 과목코드"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </FormControl>
));

// 학점 선택 컴포넌트
const CreditsSelect = memo(({
  value,
  onChange
}: {
  value?: number;
  onChange: (value: string) => void;
}) => (
  <FormControl>
    <FormLabel>학점</FormLabel>
    <Select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">전체</option>
      <option value="1">1학점</option>
      <option value="2">2학점</option>
      <option value="3">3학점</option>
    </Select>
  </FormControl>
));

// 학년 체크박스 컴포넌트
const GradesCheckbox = memo(({
  value,
  onChange
}: {
  value: number[];
  onChange: (values: number[]) => void;
}) => (
  <FormControl>
    <FormLabel>학년</FormLabel>
    <CheckboxGroup value={value} onChange={(vals) => onChange(vals.map(Number))}>
      <HStack spacing={4}>
        {[1, 2, 3, 4].map((grade) => (
          <Checkbox key={grade} value={grade}>{grade}학년</Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  </FormControl>
));

// 요일 체크박스 컴포넌트
const DaysCheckbox = memo(({
  value,
  onChange
}: {
  value: string[];
  onChange: (values: string[]) => void;
}) => (
  <FormControl>
    <FormLabel>요일</FormLabel>
    <CheckboxGroup value={value} onChange={(vals) => onChange(vals as string[])}>
      <HStack spacing={4}>
        {DAY_LABELS.map((day) => (
          <Checkbox key={day} value={day}>{day}</Checkbox>
        ))}
      </HStack>
    </CheckboxGroup>
  </FormControl>
));

// 시간 체크박스 컴포넌트
const TimesCheckbox = memo(({
  value,
  onChange
}: {
  value: number[];
  onChange: (values: number[]) => void;
}) => (
  <FormControl>
    <FormLabel>시간</FormLabel>
    <CheckboxGroup
      colorScheme="green"
      value={value}
      onChange={(vals) => onChange(vals.map(Number))}
    >
      <Wrap spacing={1} mb={2}>
        {value.sort((a, b) => a - b).map((time) => (
          <Tag key={time} size="sm" variant="outline" colorScheme="blue">
            <TagLabel>{time}교시</TagLabel>
            <TagCloseButton onClick={() => onChange(value.filter((v) => v !== time))} />
          </Tag>
        ))}
      </Wrap>
      <Stack
        spacing={2}
        overflowY="auto"
        h="100px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius={5}
        p={2}
      >
        {TIME_SLOTS.map(({ id, label }) => (
          <Box key={id}>
            <Checkbox size="sm" value={id}>{id}교시({label})</Checkbox>
          </Box>
        ))}
      </Stack>
    </CheckboxGroup>
  </FormControl>
));

// 전공 체크박스 컴포넌트
const MajorsCheckbox = memo(({
  value,
  onChange,
  allMajors
}: {
  value: string[];
  onChange: (values: string[]) => void;
  allMajors: string[];
}) => (
  <FormControl>
    <FormLabel>전공</FormLabel>
    <CheckboxGroup
      colorScheme="green"
      value={value}
      onChange={(vals) => onChange(vals as string[])}
    >
      <Wrap spacing={1} mb={2}>
        {value.map((major) => (
          <Tag key={major} size="sm" variant="outline" colorScheme="blue">
            <TagLabel>{major.split("<p>").pop()}</TagLabel>
            <TagCloseButton onClick={() => onChange(value.filter((v) => v !== major))} />
          </Tag>
        ))}
      </Wrap>
      <Stack
        spacing={2}
        overflowY="auto"
        h="100px"
        border="1px solid"
        borderColor="gray.200"
        borderRadius={5}
        p={2}
      >
        {allMajors.map((major) => (
          <MajorCheckbox key={major} major={major} />
        ))}
      </Stack>
    </CheckboxGroup>
  </FormControl>
));

// 클로저를 이용한 캐싱 구현
const createCachedFetch = <T,>(fetcher: () => Promise<T>) => {
  let cache: Promise<T> | null = null;
  return () => {
    if (!cache) {
      cache = fetcher();
    }
    return cache;
  };
};

const fetchMajors = createCachedFetch(() => axios.get<Lecture[]>('/schedules-majors.json'));
const fetchLiberalArts = createCachedFetch(() => axios.get<Lecture[]>('/schedules-liberal-arts.json'));

// Promise.all을 올바르게 사용: 배열 내부에서 await를 제거하여 병렬로 실행
const fetchAllLectures = async () => {
  const promises = [
    (console.log('API Call 1', performance.now()), fetchMajors()),
    (console.log('API Call 2', performance.now()), fetchLiberalArts()),
    (console.log('API Call 3', performance.now()), fetchMajors()),
    (console.log('API Call 4', performance.now()), fetchLiberalArts()),
    (console.log('API Call 5', performance.now()), fetchMajors()),
    (console.log('API Call 6', performance.now()), fetchLiberalArts()),
  ];

  return await Promise.all(promises);
};

// TODO: 이 컴포넌트에서 불필요한 연산이 발생하지 않도록 다양한 방식으로 시도해주세요.
const SearchDialog = ({ searchInfo, onClose }: Props) => {
  const { setSchedulesMap } = useScheduleContext();

  const loaderWrapperRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [page, setPage] = useState(1);
  const [searchOptions, setSearchOptions] = useState<SearchOption>({
    query: '',
    grades: [],
    days: [],
    times: [],
    majors: [],
  });

  // 필터링된 강의 목록 - searchOptions나 lectures가 변경될 때만 재계산
  const filteredLectures = useMemo(() => {
    const { query = '', credits, grades, days, times, majors } = searchOptions;

    return lectures
      .filter((lecture) =>
        lecture.title.toLowerCase().includes(query.toLowerCase()) ||
        lecture.id.toLowerCase().includes(query.toLowerCase())
      )
      .filter((lecture) => grades.length === 0 || grades.includes(lecture.grade))
      .filter((lecture) => majors.length === 0 || majors.includes(lecture.major))
      .filter((lecture) => !credits || lecture.credits.startsWith(String(credits)))
      .filter((lecture) => {
        if (days.length === 0 && times.length === 0) return true;

        const schedules = lecture.schedule ? parseSchedule(lecture.schedule) : [];
        const dayMatch = days.length === 0 || schedules.some((s) => days.includes(s.day));
        const timeMatch = times.length === 0 || schedules.some((s) => s.range.some((t) => times.includes(t)));

        return dayMatch && timeMatch;
      });
  }, [lectures, searchOptions]);

  // slice는 기존 배열 참조를 유지하므로 LectureRow의 memo가 정상 작동
  const lastPage = Math.ceil(filteredLectures.length / PAGE_SIZE);
  const visibleLectures = filteredLectures.slice(0, page * PAGE_SIZE);

  // 전공 목록 메모이제이션
  const allMajors = useMemo(() => [...new Set(lectures.map(lecture => lecture.major))], [lectures]);

  // useCallback으로 메모이제이션하여 자식 컴포넌트 리렌더링 방지
  const changeSearchOption = useCallback(
    (field: keyof SearchOption, value: SearchOption[typeof field]) => {
      setPage(1);
      setSearchOptions((prev) => ({ ...prev, [field]: value }));
      loaderWrapperRef.current?.scrollTo(0, 0);
    },
    []
  );

  // 각 필드별 핸들러 메모이제이션
  const onQueryChange = useCallback(
    (value: string) => changeSearchOption('query', value),
    [changeSearchOption]
  );

  const onCreditsChange = useCallback(
    (value: string) => changeSearchOption('credits', value),
    [changeSearchOption]
  );

  const onGradesChange = useCallback(
    (values: number[]) => changeSearchOption('grades', values),
    [changeSearchOption]
  );

  const onDaysChange = useCallback(
    (values: string[]) => changeSearchOption('days', values),
    [changeSearchOption]
  );

  const onTimesChange = useCallback(
    (values: number[]) => changeSearchOption('times', values),
    [changeSearchOption]
  );

  const onMajorsChange = useCallback(
    (values: string[]) => changeSearchOption('majors', values),
    [changeSearchOption]
  );

  // useCallback으로 메모이제이션하여 LectureRow의 불필요한 리렌더링 방지
  const addSchedule = useCallback((lecture: Lecture) => {
    if (!searchInfo) return;

    const { tableId } = searchInfo;

    const schedules = parseSchedule(lecture.schedule).map(schedule => ({
      ...schedule,
      lecture
    }));

    setSchedulesMap(prev => ({
      ...prev,
      [tableId]: [...prev[tableId], ...schedules]
    }));

    onClose();
  }, [searchInfo, setSchedulesMap, onClose]);

  useEffect(() => {
    const start = performance.now();
    console.log('API 호출 시작: ', start)
    fetchAllLectures().then(results => {
      const end = performance.now();
      console.log('모든 API 호출 완료 ', end)
      console.log('API 호출에 걸린 시간(ms): ', end - start)
      setLectures(results.flatMap(result => result.data));
    })
  }, []);

  useEffect(() => {
    const $loader = loaderRef.current;
    const $loaderWrapper = loaderWrapperRef.current;

    if (!$loader || !$loaderWrapper) {
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setPage(prevPage => Math.min(lastPage, prevPage + 1));
        }
      },
      { threshold: 0, root: $loaderWrapper }
    );

    observer.observe($loader);

    return () => observer.unobserve($loader);
  }, [lastPage]);

  useEffect(() => {
    setSearchOptions(prev => ({
      ...prev,
      days: searchInfo?.day ? [searchInfo.day] : [],
      times: searchInfo?.time ? [searchInfo.time] : [],
    }))
    setPage(1);
  }, [searchInfo]);

  return (
    <Modal isOpen={Boolean(searchInfo)} onClose={onClose} size="6xl">
      <ModalOverlay/>
      <ModalContent maxW="90vw" w="1000px">
        <ModalHeader>수업 검색</ModalHeader>
        <ModalCloseButton/>
        <ModalBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <SearchQueryInput
                value={searchOptions.query ?? ''}
                onChange={onQueryChange}
              />
              <CreditsSelect
                value={searchOptions.credits}
                onChange={onCreditsChange}
              />
            </HStack>

            <HStack spacing={4}>
              <GradesCheckbox
                value={searchOptions.grades}
                onChange={onGradesChange}
              />
              <DaysCheckbox
                value={searchOptions.days}
                onChange={onDaysChange}
              />
            </HStack>

            <HStack spacing={4}>
              <TimesCheckbox
                value={searchOptions.times}
                onChange={onTimesChange}
              />
              <MajorsCheckbox
                value={searchOptions.majors}
                onChange={onMajorsChange}
                allMajors={allMajors}
              />
            </HStack>
            <Text align="right">
              검색결과: {filteredLectures.length}개
            </Text>
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
                      <LectureRow
                        key={`${lecture.id}-${index}`}
                        lecture={lecture}
                        onAddSchedule={addSchedule}
                      />
                    ))}
                  </Tbody>
                </Table>
                <Box ref={loaderRef} h="20px"/>
              </Box>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchDialog;