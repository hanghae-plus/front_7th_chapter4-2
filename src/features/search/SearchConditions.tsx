import { memo, useEffect, useRef, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import {
  Box,
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Select,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
  Wrap,
} from '@chakra-ui/react';
import { DAY_LABELS } from '../../constants.ts';
import { SearchOption } from '../../types.ts';

const TIME_SLOTS = [
  { id: 1, label: '09:00~09:30' },
  { id: 2, label: '09:30~10:00' },
  { id: 3, label: '10:00~10:30' },
  { id: 4, label: '10:30~11:00' },
  { id: 5, label: '11:00~11:30' },
  { id: 6, label: '11:30~12:00' },
  { id: 7, label: '12:00~12:30' },
  { id: 8, label: '12:30~13:00' },
  { id: 9, label: '13:00~13:30' },
  { id: 10, label: '13:30~14:00' },
  { id: 11, label: '14:00~14:30' },
  { id: 12, label: '14:30~15:00' },
  { id: 13, label: '15:00~15:30' },
  { id: 14, label: '15:30~16:00' },
  { id: 15, label: '16:00~16:30' },
  { id: 16, label: '16:30~17:00' },
  { id: 17, label: '17:00~17:30' },
  { id: 18, label: '17:30~18:00' },
  { id: 19, label: '18:00~18:50' },
  { id: 20, label: '18:55~19:45' },
  { id: 21, label: '19:50~20:40' },
  { id: 22, label: '20:45~21:35' },
  { id: 23, label: '21:40~22:30' },
  { id: 24, label: '22:35~23:25' },
];

interface Props {
  searchOptions: SearchOption;
  allMajors: string[];
  onSearchQuery: (query: string) => void;
  onChangeOption: (
    field: keyof SearchOption,
    value: SearchOption[typeof field],
  ) => void;
}

const SearchConditions = memo(
  ({ searchOptions, allMajors, onSearchQuery, onChangeOption }: Props) => {
    return (
      <>
        <HStack spacing={4}>
          <SearchInput onSearch={onSearchQuery} />
          <CreditSelect
            onChange={(credits) => onChangeOption('credits', credits)}
          />
        </HStack>

        <HStack spacing={4}>
          <GradeCheckbox
            grades={searchOptions.grades}
            onChange={(grades) => onChangeOption('grades', grades)}
          />

          <DayCheckbox
            days={searchOptions.days}
            onChange={(days) => onChangeOption('days', days)}
          />
        </HStack>

        <HStack spacing={4}>
          <TimeCheckbox
            times={searchOptions.times}
            onChange={(times) => onChangeOption('times', times)}
          />

          <MajorCheckbox
            majors={searchOptions.majors}
            onChange={(majors) => onChangeOption('majors', majors)}
            allMajors={allMajors}
          />
        </HStack>
      </>
    );
  },
);

export default SearchConditions;

const SearchInput = memo(
  ({ onSearch }: { onSearch: (query: string) => void }) => {
    const [query, setQuery] = useState<string>('');

    useEffect(() => {
      const timer = setTimeout(() => {
        onSearch(query);
      }, 300);

      return () => clearTimeout(timer);
    }, [query, onSearch]);

    return (
      <FormControl>
        <FormLabel>검색어</FormLabel>
        <Input
          placeholder="과목명 또는 과목코드"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </FormControl>
    );
  },
);

const CreditSelect = memo(
  ({ onChange }: { onChange: (credits: number) => void }) => {
    return (
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select
          defaultValue=""
          onChange={(e) => onChange(Number(e.target.value))}
        >
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    );
  },
);

const GradeCheckbox = memo(
  ({
    grades,
    onChange,
  }: {
    grades: number[];
    onChange: (grades: number[]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>학년</FormLabel>
        <CheckboxGroup
          value={grades}
          onChange={(value) => onChange(value.map(Number))}
        >
          <HStack spacing={4}>
            {[1, 2, 3, 4].map((grade) => (
              <Checkbox key={grade} value={grade}>
                {grade}학년
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  },
);

const DayCheckbox = memo(
  ({
    days,
    onChange,
  }: {
    days: string[];
    onChange: (days: string[]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>요일</FormLabel>
        <CheckboxGroup
          value={days}
          onChange={(value) => onChange(value as string[])}
        >
          <HStack spacing={4}>
            {DAY_LABELS.map((day) => (
              <Checkbox key={day} value={day}>
                {day}
              </Checkbox>
            ))}
          </HStack>
        </CheckboxGroup>
      </FormControl>
    );
  },
);

const MajorCheckbox = memo(
  ({
    majors,
    onChange,
    allMajors,
  }: {
    majors: string[];
    onChange: (majors: string[]) => void;
    allMajors: string[];
  }) => {
    const parentRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
      count: allMajors.length,
      getScrollElement: () => parentRef.current,
      estimateSize: () => 24,
      overscan: 2,
    });

    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={majors}
          onChange={(values) => onChange(values as string[])}
        >
          <Wrap spacing={1} mb={2}>
            {majors.map((major) => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split('<p>').pop()}</TagLabel>
                <TagCloseButton
                  onClick={() => onChange(majors.filter((v) => v !== major))}
                />
              </Tag>
            ))}
          </Wrap>
          <Box
            ref={parentRef}
            overflowY="auto"
            h="100px"
            border="1px solid"
            borderColor="gray.200"
            borderRadius={5}
            p={2}
          >
            <Box h={`${virtualizer.getTotalSize()}px`} position="relative">
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const major = allMajors[virtualItem.index];
                return (
                  <Box
                    key={major}
                    position="absolute"
                    top={0}
                    left={0}
                    w="100%"
                    h={`${virtualItem.size}px`}
                    transform={`translateY(${virtualItem.start}px)`}
                  >
                    <Checkbox size="sm" value={major}>
                      {major.replace(/<p>/gi, ' ')}
                    </Checkbox>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </CheckboxGroup>
      </FormControl>
    );
  },
);

const TimeCheckbox = memo(
  ({
    times,
    onChange,
  }: {
    times: number[];
    onChange: (times: number[]) => void;
  }) => {
    return (
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={times}
          onChange={(values) => onChange(values.map(Number))}
        >
          <Wrap spacing={1} mb={2}>
            {times
              .sort((a, b) => a - b)
              .map((time) => (
                <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                  <TagLabel>{time}교시</TagLabel>
                  <TagCloseButton
                    onClick={() => onChange(times.filter((v) => v !== time))}
                  />
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
                <Checkbox key={id} size="sm" value={id}>
                  {id}교시({label})
                </Checkbox>
              </Box>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    );
  },
);
