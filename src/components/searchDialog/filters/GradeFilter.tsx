import { memo } from 'react';
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormLabel,
  HStack,
} from '@chakra-ui/react';

interface GradeFilterProps {
  value: number[];
  onChange: (value: number[]) => void;
}

const GradeFilter = memo(({ value, onChange }: GradeFilterProps) => {
  return (
    <FormControl>
      <FormLabel>학년</FormLabel>
      <CheckboxGroup
        value={value}
        onChange={(v) => onChange(v.map(Number))}
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
});

export default GradeFilter;
