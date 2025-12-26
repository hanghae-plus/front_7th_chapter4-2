import { memo, useMemo } from "react";
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
} from "@chakra-ui/react";
import { DAY_LABELS } from "../../constants.ts";
import { SearchOption } from "../../types.ts";

type ChangeSearchOption = (
  field: keyof SearchOption,
  value: SearchOption[keyof SearchOption],
) => void;

export const SearchQueryControl = memo(
  ({ value, onChange }: { value: string; onChange: ChangeSearchOption }) => (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={(e) => onChange("query", e.target.value)}
      />
    </FormControl>
  ),
);

export const CreditsControl = memo(
  ({
    value,
    onChange,
  }: {
    value: SearchOption["credits"];
    onChange: ChangeSearchOption;
  }) =>{
    console.log("CreditsControl",value);
    return ((
      <FormControl>
        <FormLabel>학점</FormLabel>
        <Select value={value} onChange={(e) => onChange("credits", e.target.value)}>
          <option value="">전체</option>
          <option value="1">1학점</option>
          <option value="2">2학점</option>
          <option value="3">3학점</option>
        </Select>
      </FormControl>
    ))
  },
);

export const GradesControl = memo(
  ({
    value,
    onChange,
  }: {
    value: number[];
    onChange: ChangeSearchOption;
  }) => (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup value={value} onChange={(vals) => onChange("grades", (vals as number[]).map(Number))}>
        <HStack spacing={4}>
          {[1, 2, 3, 4].map((grade) => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  ),
);

export const DaysControl = memo(
  ({
    value,
    onChange,
  }: {
    value: string[];
    onChange: ChangeSearchOption;
  }) => (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup value={value} onChange={(vals) => onChange("days", vals as string[])}>
        <HStack spacing={4}>
          {DAY_LABELS.map((day) => (
            <Checkbox key={day} value={day}>
              {day}
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  ),
);

export const TimesControl = memo(
  ({
    value,
    timeSlots,
    onChange,
  }: {
    value: number[];
    timeSlots: { id: number; label: string }[];
    onChange: ChangeSearchOption;
  }) => {
    const sortedTimes = useMemo(() => [...value].sort((a, b) => a - b), [value]);

    return (
      <FormControl>
        <FormLabel>시간</FormLabel>
        <CheckboxGroup
          colorScheme="green"
          value={value}
          onChange={(vals) => onChange("times", (vals as number[]).map(Number))}
        >
          <Wrap spacing={1} mb={2}>
            {sortedTimes.map((time) => (
              <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{time}교시</TagLabel>
                <TagCloseButton onClick={() => onChange("times", value.filter((v) => v !== time))} />
              </Tag>
            ))}
          </Wrap>
          <Stack spacing={2} overflowY="auto" h="100px" border="1px solid" borderColor="gray.200" borderRadius={5} p={2}>
            {timeSlots.map(({ id, label }) => (
              <Box key={id}>
                <Checkbox size="sm" value={id}>
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

export const MajorsControl = memo(
  ({
    value,
    allMajors,
    onChange,
  }: {
    value: string[];
    allMajors: string[];
    onChange: ChangeSearchOption;
  }) => (
    <FormControl>
      <FormLabel>전공</FormLabel>
      <CheckboxGroup colorScheme="green" value={value} onChange={(vals) => onChange("majors", vals as string[])}>
        <Wrap spacing={1} mb={2}>
          {value.map((major) => (
            <Tag key={major} size="sm" variant="outline" colorScheme="blue">
              <TagLabel>{major.split("<p>").pop()}</TagLabel>
              <TagCloseButton onClick={() => onChange("majors", value.filter((v) => v !== major))} />
            </Tag>
          ))}
        </Wrap>
        <Stack spacing={2} overflowY="auto" h="100px" border="1px solid" borderColor="gray.200" borderRadius={5} p={2}>
          {allMajors.map((major) => (
            <Box key={major}>
              <Checkbox size="sm" value={major}>
                {major.replace(/<p>/gi, " ")}
              </Checkbox>
            </Box>
          ))}
        </Stack>
      </CheckboxGroup>
    </FormControl>
  ),
);
