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
import { memo } from 'react';
import { DAY_LABELS } from '../../constants/common';
import { TIME_SLOTS } from '../../constants/search';
import { SearchOption } from '../../types/search';

export type SearchFormControlProps<K extends keyof SearchOption> = {
  value: SearchOption[K];
  onChange: (value: SearchOption[K]) => void;
};

export const QueryInput = memo(({ value, onChange }: SearchFormControlProps<'query'>) => {
  return (
    <FormControl>
      <FormLabel>검색어</FormLabel>
      <Input
        placeholder="과목명 또는 과목코드"
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </FormControl>
  );
});

export const CreditsSelect = memo(({ value, onChange }: SearchFormControlProps<'credits'>) => {
  return (
    <FormControl>
      <FormLabel>학점</FormLabel>
      <Select value={value} onChange={e => onChange(+e.target.value)}>
        <option value="">전체</option>
        <option value="1">1학점</option>
        <option value="2">2학점</option>
        <option value="3">3학점</option>
      </Select>
    </FormControl>
  );
});

export const GradesCheckboxes = memo(({ value, onChange }: SearchFormControlProps<'grades'>) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup value={value} onChange={value => onChange(value.map(Number))}>
        <HStack spacing={4}>
          {[1, 2, 3, 4].map(grade => (
            <Checkbox key={grade} value={grade}>
              {grade}학년
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});

export const DaysCheckboxes = memo(({ value, onChange }: SearchFormControlProps<'days'>) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup value={value} onChange={onChange}>
        <HStack spacing={4}>
          {DAY_LABELS.map(day => (
            <Checkbox key={day} value={day}>
              {day}
            </Checkbox>
          ))}
        </HStack>
      </CheckboxGroup>
    </FormControl>
  );
});

export const TimesCheckboxes = memo(({ value, onChange }: SearchFormControlProps<'times'>) => {
  return (
    <FormControl>
      <FormLabel>시간</FormLabel>
      <CheckboxGroup
        colorScheme="green"
        value={value}
        onChange={values => onChange(values.map(Number))}
      >
        <Wrap spacing={1} mb={2}>
          {value
            .sort((a, b) => a - b)
            .map(time => (
              <Tag key={time} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{time}교시</TagLabel>
                <TagCloseButton onClick={() => onChange(value.filter(v => v !== time))} />
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
});

export const MajorsCheckboxes = memo(
  ({ value, onChange, items }: SearchFormControlProps<'majors'> & { items: string[] }) => {
    return (
      <FormControl>
        <FormLabel>전공</FormLabel>
        <CheckboxGroup colorScheme="green" value={value} onChange={onChange}>
          <Wrap spacing={1} mb={2}>
            {value.map(major => (
              <Tag key={major} size="sm" variant="outline" colorScheme="blue">
                <TagLabel>{major.split('<p>').pop()}</TagLabel>
                <TagCloseButton onClick={() => onChange(value.filter(v => v !== major))} />
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
            {items.map(item => (
              <Box key={item}>
                <Checkbox key={item} size="sm" value={item}>
                  {item.replace(/<p>/gi, ' ')}
                </Checkbox>
              </Box>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
    );
  },
);
