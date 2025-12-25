import { memo } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';
import { DAY_LABELS } from '../../../constants';

interface DayFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const DayFilter = memo(({ value, onChange }: DayFilterProps) => {
  return (
    <FormControl>
      <FormLabel>요일</FormLabel>
      <CheckboxGroup
        value={value}
        onChange={(v) => onChange(v as string[])}
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
});

export default DayFilter;
